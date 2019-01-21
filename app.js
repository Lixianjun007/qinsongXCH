App({

  //所有部门
  department_all : ['A.Deck', 'B.Food and beverage', 'C.Photography', 'D.Engine', 'E.Finance', 'F.Human Resources', 'G.Medical', 'H.Cruise program', 'I.Casino', 'J.Surveillance', 'K.Production / theater ', 'L.Guest entertainment', 'M.Hotel', 'N.Musician', 'O.Concession', 'P.Galley', 'Q.IT', 'R.Restaurant', 'S.Bar', 'T.House miscellaneous', 'U.Shore excursions','V.Housekeeping','W.Guest Services','X.Spa','Y.Gift Shop','Z.Art','AA.Internet'],
  
  ship_all: ['NCL','COSTA'],

  data: {
    // 用户信息缓存key
    cache_user_info_key: 'cache_chuan_user_info_key',

    // 设备信息缓存key
    cache_system_info_key: 'cache_chuan_system_info_key',

    // 默认用户头像
    default_user_head_src: '/images/default-user.png',


    // 默认选中右上角打勾图标
    default_right_top_tick_selected_icon_src: '/images/default-tick-selected-icon.png',

    // 成功圆形提示图片
    default_round_success_icon: '/images/default-round-success-icon.png',

    // 错误圆形提示图片
    default_round_error_icon: '/images/default-round-error-icon.png',

    // app类型
    application_type: 'default',

    // 请求地址
    request_url: 'http://qinsongc.net/',

    // 基础信息
    application_title: '琴松货运代理',
    applicationa_describe: '琴松货运代理',
  },

  /**
   * 小程序初始化
   */
  onLaunch(options)
  {
    // 设置设备信息
    this.set_system_info();
  },


  /**
   * 获取设备信息
   */
  get_system_info()
  {
    let system_info = my.getStorageSync({ key: this.data.cache_system_info_key });
    if((system_info.data || null) == null)
    {
      return this.set_system_info();
    }
    return system_info.data;
  },

  /**
   * 设置设备信息
   */
  set_system_info()
  {
    var system_info = my.getSystemInfoSync();
    my.setStorage({
      key: this.data.cache_system_info_key,
      data: system_info
    });
    return system_info;
  },

  /**
   * 请求地址生成
   */
  get_request_url(a, c, m, params)
  {
    a = a || 'Index';
    c = c || 'Index';
    m = m || 'Home';
    params = params || '';
    if(params != '' && params.substr(0, 1) != '&')
    {
      params = '&'+params;
    }
    var user = this.GetUserCacheInfo();
    var app_client_user_id = (user == false) ? '' : user.alipay_openid;
    var user_id = (user == false) ? 0 : (user.id || 0);
    var nickname = (user == false) ? '' : user.nick_name;
    return this.data.request_url+'index.php?m='+m+'&c='+c+'&a='+a+'&app_client_type=alipay&app_client_user_id='+app_client_user_id+'&user_id='+user_id+'&nickname='+nickname+'&ajax=ajax&application_type='+this.data.application_type+'&application=app'+params;
  },

  /**
   * 获取平台用户信息
   * object     回调操作对象
   * method     回调操作对象的函数
   * return     有用户数据直接返回, 则回调调用者
   */
  GetUserInfo(object, method)
  {
    var user = this.GetUserCacheInfo();
    if(user == false)
    {
      // 唤醒用户授权
      this.UserAuthCode(object, method);

      return false;
    } else {
      return user;
    }
  },

  /**
   * 从缓存获取用户信息
   */
  GetUserCacheInfo()
  {
    let user = my.getStorageSync({ key: this.data.cache_user_info_key });
    if((user.data || null) == null)
    {
      return false;
    }
    return user.data;
  },

  /**
   * 用户授权
   * object     回调操作对象
   * method     回调操作对象的函数
   */
  UserAuthCode(object, method)
  {
    // 加载loding
    my.showLoading({content: '授权中 Authorization...'});

    // 请求授权接口
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        if(res.authCode) {
          my.httpRequest({
            url: this.get_request_url('GetAlipayUserInfo', 'User'),
            method: 'POST',
            data: {authcode: res.authCode},
            dataType: 'json',
            success: (res) => {
              my.hideLoading();
              if(res.data.code == 0)
              {
                my.setStorage({
                  key: this.data.cache_user_info_key,
                  data: res.data.data
                });

                if(typeof object === 'object' && (method || null) != null)
                {
                  object[method]();
                } else {
                  my.showToast({
                    type: 'success',
                    content: '授权成功 Authorization success'
                  });
                }
              } else {
                my.showToast({
                  type: 'fail',
                  content: res.data.msg
                });
              }
            },
            fail: (e) => {
              my.hideLoading();

              my.showToast({
                type: 'fail',
                content: '服务器请求出错 service error'
              });
            }
          });
        }
      },
      fail: (e) => {
        my.hideLoading();

        my.showToast({
          type: 'fail',
          content: '授权失败 Authorization failure'
        });
      }
    });
  },

  /**
   * 字段数据校验
   * data           待校验的数据, 一维json对象
   * validation     待校验的字段, 格式 [{fields: 'mobile', msg: '请填写手机号码'}, ...]
  */
  fields_check(data, validation)
  {
    for(var i in validation)
    {
      if(data[validation[i]['fields']].length == 0 || data[validation[i]['fields']] == -1)
      {
        my.showToast({
          type: 'fail',
          content: validation[i]['msg']
        });
        return false;
      }
    }
    return true;
  },

  /**
   * 获取当前时间戳
   */
  get_timestamp()
  {
    return parseInt(new Date().getTime()/1000);
  },

  /**
   * 获取日期
   * format       日期格式（默认 yyyy-MM-dd h:m:s）
   * timestamp    时间戳（默认当前时间戳）
   */
  get_date(format, timestamp)
  {
    var d = new Date((timestamp || this.get_timestamp()) * 1000);
    var date = {
      "M+": d.getMonth() + 1,
      "d+": d.getDate(),
      "h+": d.getHours(),
      "m+": d.getMinutes(),
      "s+": d.getSeconds(),
      "q+": Math.floor((d.getMonth() + 3) / 3),
      "S+": d.getMilliseconds()
    };
    if(/(y+)/i.test(format))
    {
      format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for(var k in date)
    {
      if(new RegExp("(" + k + ")").test(format))
      {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
      }
    }
    return format;
  },

  /**
   * 获取对象、数组的长度、元素个数
   * obj      要计算长度的元素（object、array、string）
   */
  get_length(obj)
  {
    var obj_type = typeof obj;
    if(obj_type == "string")
    {
        return obj.length;
      } else if(obj_type == "object")
      {
        var obj_len = 0;
        for(var i in obj)
        {
            obj_len++;
        }
        return obj_len;
    }
    return false;
  },

  /**
   * 价格保留两位小数
   * price      价格保留两位小数
   */
  price_two_decimal(x)  
  {  
    var f_x = parseFloat(x);
    if(isNaN(f_x))
    {
      return 0;
    }
    var f_x = Math.round(x*100)/100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if(pos_decimal < 0)
    {
      pos_decimal = s_x.length;
      s_x += '.';
    }  
    while(s_x.length <= pos_decimal + 2)
    {
      s_x += '0';
    }
    return s_x;
  }

});
