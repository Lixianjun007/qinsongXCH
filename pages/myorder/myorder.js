const app = getApp();
let system_info = app.get_system_info();
Page({
  data: {
    data_list_loding_status: 1,
    form_loading: false,
    data_loding_status: false,
    form_keywords: '',
    data_list: [],
    data_total: 0,
    data_page_total: 0,
    data_page: 1,
    scroll_height: system_info.windowHeight,
    data_bottom_line_status: false,
    default_shop_icon: app.data.default_shop_icon,
    default_booking_icon: app.data.default_booking_icon,
    default_time_icon: app.data.default_time_icon,
  },

  /**
   * 初始化
   */
  onLoad()
  {
    // 获取我的订单列表
    this.get_data_list();
  },

  /**
   * 页面显示
   */
  onShow()
  {
    // 标题设置
    my.setNavigationBar({title: '我的订单 My order'});
  },

  /**
   * 获取我的订单列表
   * is_mandatory   是否强制请求（0否, 1是 默认0）
   */
  get_data_list(is_mandatory)
  {
    // 分页是否还有数据
    if((is_mandatory || 0) == 0)
    {
      if(this.data.data_bottom_line_status == true)
      {
        return false;
      }
    } else {
      this.setData({data_bottom_line_status: false});
    }

    // 加载loding
    my.showLoading({content: '加载中 loading...'});
    this.setData({
      data_list_loding_status: 1,
      form_loading: true,
    });

    // 获取数据
    my.httpRequest({
      url: app.get_request_url('Index', 'Order'),
      method: 'POST',
      data: {page: this.data.data_page, keywords: this.data.form_keywords},
      dataType: 'json',
      success: (res) => {
        my.hideLoading();
        my.stopPullDownRefresh();

        if(res.data.code == 0)
        {
          if(res.data.data.data.length > 0)
          {
            if(this.data.data_page <= 1)
            {
              var temp_data_list = res.data.data.data;
            } else {
              var temp_data_list = this.data.data_list;
              var temp_data = res.data.data.data;
              for(var i in temp_data)
              {
                temp_data_list.push(temp_data[i]);
              }
            }
            this.setData({
              data_list: temp_data_list,
              data_total: res.data.data.total,
              data_page_total: res.data.data.page_total,
              data_list_loding_status: 3,
              form_loading: false,
              data_page: this.data.data_page+1,
            });

            // 是否还有数据
            if(this.data.data_page > 1 && this.data.data_page > this.data.data_page_total)
            {
              this.setData({data_bottom_line_status: true});
            }
          } else {
            this.setData({
              data_list_loding_status: 0,
              form_loading: false,
            });
          }
        } else {
          this.setData({
            data_list_loding_status: 0,
            form_loading: false,
          });

          my.showToast({
            type: 'fail',
            content: res.data.msg
          });
        }
      },
      fail: () => {
        my.hideLoading();
        my.stopPullDownRefresh();

        this.setData({
          data_list_loding_status: 2,
          form_loading: false,
        });
        my.showToast({
          type: 'fail',
          content: '服务器请求出错 service error'
        });
      }
    });
  },

  /**
   * 支付事件
   */
  operation_pay_event(e)
  {
    // 参数
    var index = e.target.dataset.index;
    var value = e.target.dataset.value;
    
    // 加载loding
    my.showLoading({content: '处理中 processing ...'});

    // 请求支付
    my.httpRequest({
      url: app.get_request_url('Pay', 'Order'),
      method: 'POST',
      data: {order_id: value},
      dataType: 'json',
      success: (res) => {
        my.hideLoading();
        if(res.data.code == 0)
        {
          my.tradePay({
            orderStr: res.data.data,
            success: (res) => {
              // 数据设置
              if(res.resultCode == '9000')
              {
                var temp_data_list = this.data.data_list;
                temp_data_list[index]['status'] = 2;
                this.setData({data_list: temp_data_list});
              }

              // 跳转支付页面
              my.navigateTo({
                url: '/pages/paytips/paytips?code='+res.resultCode+'&result='+res.result
              });
            },
            fail: (res) => {
              my.showToast({
                type: 'fail',
                content: '唤起支付模块失败 pay failure'
              });
            }
          });
        } else {
          my.showToast({
            type: 'fail',
            content: res.data.msg
          });
        }
      },
      fail: () => {
        my.hideLoading();
        my.showToast({
          type: 'fail',
          content: '服务器请求出错 service error'
        });
      }
    });
  },

  /**
   * 订单取消
   */
  operation_cancel_event(e)
  {
    my.confirm({
      title: '温馨提示 Tips',
      content: '取消后不可恢复，确定继续吗 unrecoverable To continue?',
      confirmButtonText: '确认 Ok',
      cancelButtonText: '不了 Don\'t',
      success: (result) => {
        if(result.confirm)
        {
          // 参数
          var index = e.target.dataset.index;
          var value = e.target.dataset.value;

          my.showLoading({content: '处理中 processing...'});
          my.httpRequest({
            url: app.get_request_url('Cancel', 'Order'),
            method: 'POST',
            data: {order_id: value},
            dataType: 'json',
            success: (res) => {
              my.hideLoading();
              if(res.data.code == 0)
              {
                var temp_data_list = this.data.data_list;
                temp_data_list[index]['status'] = 4;
                this.setData({data_list: temp_data_list});

                my.showToast({
                  type: 'success',
                  content: res.data.msg
                });
              } else {
                my.showToast({
                  type: 'fail',
                  content: res.data.msg
                });
              }
            },
            fail: () => {
              my.hideLoading();
              my.showToast({
                type: 'fail',
                content: '服务器请求出错 service error'
              });
            }
          });
        } 
      }
    });
  },

  /**
   * 订单确认
   */
  operation_success_event(e)
  {
    my.confirm({
      title: '温馨提示 Tips',
      content: '确认已收到货物，确定继续吗 Confirmation received?',
      confirmButtonText: '确认 Ok',
      cancelButtonText: '没有 Not ',
      success: (result) => {
        if(result.confirm)
        {
          // 参数
          var index = e.target.dataset.index;
          var value = e.target.dataset.value;

          my.showLoading({content: '处理中 processing...'});
          my.httpRequest({
            url: app.get_request_url('Success', 'Order'),
            method: 'POST',
            data: {order_id: value},
            dataType: 'json',
            success: (res) => {
              my.hideLoading();
              if(res.data.code == 0)
              {
                var temp_data_list = this.data.data_list;
                temp_data_list[index]['status'] = 3;
                this.setData({data_list: temp_data_list});

                my.showToast({
                  type: 'success',
                  content: res.data.msg
                });
              } else {
                my.showToast({
                  type: 'fail',
                  content: res.data.msg
                });
              }
            },
            fail: () => {
              my.hideLoading();
              my.showToast({
                type: 'fail',
                content: '服务器请求出错 service error'
              });
            }
          });
        } 
      }
    });
  },

  /**
   * 关键字事件
   */
  bind_form_keywords_input(e)
  {
    this.setData({form_keywords: e.detail.value});
  },

  /**
   * 表单搜索
   */
  formSubmit(e)
  {
    this.setData({data_page: 1});
    this.get_data_list(1);
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh()
  {
    this.setData({data_page: 1});
    this.get_data_list(1);
  },

  /**
   * 滚动加载
   */
  scroll_lower(e)
  {
    this.get_data_list();
  }
});
