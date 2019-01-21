const app = getApp();
import menuInfo from './menu.js';
// console.log(menuInfo);
Page({
  data: {
    department_all: app.department_all,
    department_index: -1,
    ship_all: app.ship_all,
    ship_index: -1,
    courier_is_show: 0,
    switch_list: [
      { name: '品牌', type: 'brand', active: 'switch-active' },
      { name: '规格', type: 'quat', active: '' }
    ],
    menu: menuInfo.menu,
    lists: [],
    courier_data: [],
    is_show_goods_name: 1,

  },
  /**
 * 部门选择
 */
  department_change(e) {
    this.setData({
      department_index: e.detail.value,
    });
  },

  /**
   * 船号选择
   */
  ship_change(e) {
    this.setData({
      ship_index: e.detail.value,
    });
  },



  /**
 * 弹窗关闭/开启操作
 */
  courier_view_close_event(e) {
    var value = e.target.dataset.value;
    this.setData({
      courier_is_show: value,
    });
    if (value == 1) {
      // 窗口数据初始化
      this.courier_view_init();
    }
  },


  /**
   * 窗口数据初始化
   */
  courier_view_init() {
    var temp_switch_list = this.data.switch_list;
    temp_switch_list[0]['active'] = 'switch-active';
    temp_switch_list[1]['active'] = '';

    var temp_menu = this.data.menu;
    for (var i in temp_menu) {
      temp_menu[i]['active'] = '';
    }

    var tmplist = menuInfo.lists.nfsq;
    this.setData({
      switch_list: temp_switch_list,
      menu: temp_menu,
      lists: tmplist,

      is_show_goods_name: 1,
      is_show_goods_kg: 0,

    });
  },

  /**
 * 品牌点击事件
 */
  list_submit_event(e) {
    var index = parseInt(e.target.dataset.value);
    var brand = e.target.dataset.tag;
    var temp_menu = this.data.menu;
    // console.log(brand);
    if (!temp_menu.hasOwnProperty(index)) {
      my.showToast({
        type: 'fail',
        content: '选项有误 select error'
      });
      return false;
    } else {
      for (var i in temp_menu) {
        if (index == i) {
          temp_menu[i]['active'] = 'courier-active';
        } else {
          temp_menu[i]['active'] = '';
        }
      }
    }
    var tmplist = menuInfo.lists[brand];
    var temp_switch_list = this.data.switch_list;
    temp_switch_list[1]['active'] = 'switch-active';
    temp_switch_list[0]['active'] = '';

    // console.log(tmplist);

    this.setData({
      menu: temp_menu,
      switch_list: temp_switch_list,
      is_show_goods_name: 0,
      is_show_goods_kg: 1,
      lists: tmplist,
      add_to_list_brand: brand,
      add_to_list_brand_display_name: temp_menu[index].display_name,
    });

  },


  //规格点击事件
  onItemTap_click(e) {
    // console.log(this.data.add_to_list_brand);
    // console.log(123);
    var index = parseInt(e.target.dataset.index);
    var tmplist = menuInfo.lists[this.data.add_to_list_brand];
    for (var i in tmplist) {
      if (index == i) {
        tmplist[i]['active'] = 'courier-active';
      } else {
        tmplist[i]['active'] = '';
      }
    }
    var tmp_arr = {
      brand: this.data.add_to_list_brand_display_name,
      display_name: tmplist[index].display_name,
      quat: tmplist[index].quat,
      quat_num: tmplist[index].quat_num,
      price: tmplist[index].price,
      number: 1,

    };
    var tmp_courier_data = this.data.courier_data;

    tmp_courier_data.push(tmp_arr);
    // console.log(tmp_arr);
    this.setData({
      lists: tmplist,
      courier_is_show: 0,
      courier_data: tmp_courier_data,
    })

    // 总价计算
    this.courier_data_kg_price();
  },


  //修改数量
  fix_water_num(e) {

    var index = parseInt(e.target.dataset.value);
    // console.log(456);
    // console.log(index);
    var temp_courier_data = this.data.courier_data;
    temp_courier_data[index].number = e.detail.value;
    this.setData({ courier_data: temp_courier_data });

    // 总价计算
    this.courier_data_kg_price();
  },


  /**
 * 单号信息移除
 */
  courier_item_remover_event(e) {
    var index = parseInt(e.target.dataset.value);
    var temp_courier_data = this.data.courier_data;
    temp_courier_data.splice(index, 1);
    this.setData({ courier_data: temp_courier_data });

    // 总价计算
    this.courier_data_kg_price();
  },
  /**
 * 订单价格计算
 */
  courier_data_kg_price() {
    var price = parseFloat(0);
    var courier_data = this.data.courier_data;
    var total_price = parseFloat(0);
    for (var i in courier_data) {
      // console.log(courier_data[i]);
      price = parseFloat(courier_data[i].price * courier_data[i].number);
      // console.log(kg);  //调试用
      total_price += parseFloat(app.price_two_decimal(price));    //lxj
    }

    // console.log(courier_data[0]);
    if (courier_data[0] == null) {   //lxj
      this.setData({ total_price: 0.00 });
    } else {
      this.setData({ total_price: (total_price < 1) ? '0.00' : total_price });
    }

    // 窗口数据初始化
    this.courier_view_init();
  },

  /**
 * 部门选择
 */
  department_change(e) {
    this.setData({
      department_index: e.detail.value,
    });
  },

  /**
   * 船号选择
   */
  ship_change(e) {
    this.setData({
      ship_index: e.detail.value,
    });
  },

  /**
 * 姓名输入事件同步
 */
  form_name_input(e) {
    this.setData({ name: e.detail.value });
  },

  /**
   * 备注输入事件同步
   */
  form_remarks_input(e) {
    this.setData({ remarks: e.detail.value });
  },

  /**
   * 手机输入事件同步
   */
  form_mobile_input(e) {
    console.log(e.detail.value);
    this.setData({ mobile: e.detail.value });
  },


  /**
 * 导航切换事件
 */
  switch_submit_event(e) {
    // 导航处理
    var type = e.target.dataset.type;
    var temp_switch_list = this.data.switch_list;
    // console.log(temp_switch_list);
    for (var i in temp_switch_list) {
      if (temp_switch_list[i]['type'] == type) {
        temp_switch_list[i]['active'] = 'switch-active';
      } else {
        temp_switch_list[i]['active'] = '';
      }
    }

    this.setData({
      switch_list: temp_switch_list,
      is_show_goods_name: (type == 'brand') ? 1 : 0,
      is_show_goods_kg: (type == 'quat') ? 1 : 0,
    });
  },

  onLoad() { },


  /**
 * 提交订单
 */
  submit_order(e) {
    console.log('sdf');
    var user = app.GetUserInfo();
    if (user == false) {
      return false;
    }
    var $this = this;
    console.log('shouji');
    // 表单数据
    var form_data = e.detail.value;
    console.log(form_data['mobile']);

    // console.log(this.data.courier_data.length);
    form_data['courier'] = this.data.courier_data.length == 0 ? '' : JSON.stringify(this.data.courier_data);
    console.log(form_data);
    // 数据校验
    var validation = [
      { fields: 'name', msg: '请填写姓名 Please fill in your name' },
      { fields: 'mobile_phone', msg: '请填写联系电话 Please fill incontact number' },
      { fields: 'department', msg: '请选择部门 Please select the department' },
      { fields: 'ship', msg: '请选择船号 Please select the Owned ship' },
      { fields: 'courier', msg: '请添加单号信息 Please add express message' },
      // { fields: 'is_agreement', msg: '请同意授权协议 Please agree to the Registration Policy' }
    ];
    if (app.fields_check(form_data, validation)) {
      var tmpthis = this;
      my.confirm({
        title: '亲',
        content: '您选择的船号是：' + app.ship_all[form_data['ship']],
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success({ confirm }) {
          if (confirm) {



            if (form_data['ship'] == 0) {
              var contents = '您的包裹将送往喜悦号邮轮';
            } else {
              var contents = '您的包裹将送往歌诗达邮轮';
            }
            my.confirm({
              title: '亲',
              content: contents,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              success({ confirm }) {

                if (confirm) {


                  // 加载loding
                  my.showLoading({ content: '处理中 loading...' });
                  tmpthis.setData({ form_submit_loading: true });

                  //获取店铺数据
                  my.httpRequest({
                    url: app.get_request_url('Add', 'Waterorder'),
                    method: 'POST',
                    data: form_data,
                    dataType: 'json',
                    success: (res) => {
                      my.hideLoading();
                      if (res.data.code == 0) {
                        my.showToast({
                          type: 'success',
                          content: '下单成功',
                        });
                        tmpthis.operation_pay_event(res.data.msg);
                        setTimeout(function () {
                          $this.form_reset();
                          my.navigateTo({
                            url: '/pages/waterorder/waterorder'
                          });
                        }, 1000);
                      } else {
                        tmpthis.setData({ form_submit_loading: false });
                        my.showToast({
                          type: 'fail',
                          content: res.data.msg
                        });
                      }
                    },
                    fail: () => {
                      my.hideLoading();
                      tmpthis.setData({ form_submit_loading: false });

                      my.showToast({
                        type: 'fail',
                        content: '服务器请求出错 service error'
                      });
                    }
                  });



                }


              },
              fail() {
                console.log('fail');
              },
              complete() {
                console.log('complete');
              },
            });

          }
        },
        fail() {

        },
        complete() {
          console.log('complete');
        },
      });
    }
  },

  /**
 * 表单重置
 */
  form_reset() {
    this.courier_view_init();

    this.setData({
      form_submit_loading: false,
      department_index: -1,
      ship_index: -1,
      courier_data: [],
      name: '',
      mobile: '',
      is_agreement: false,
      total_price: 0,
    });
  },


  /**
 * 自定义分享
 */
  onShareAppMessage() {
    return {
      title: app.data.application_title,
      desc: app.data.applicationa_describe,
      path: '/pages/index/index?share=1'
    };
  },

  /**
  * 支付事件
  */
  operation_pay_event(order_id) {
    // 参数
    var value = order_id;

    // 加载loding
    // my.showLoading({content: '处理中 processing ...'});

    // 请求支付
    my.httpRequest({
      url: app.get_request_url('Pay', 'Waterorder'),
      method: 'POST',
      data: { order_id: value },
      dataType: 'json',
      success: (res) => {
        my.hideLoading();
        console.log(res.data);
        if (res.data.code == 0) {
          my.tradePay({
            orderStr: res.data.data,
            success: (res) => {
              // 数据设置
              if (res.resultCode == '9000') {
                var temp_data_list = this.data.data_list;
                temp_data_list[index]['status'] = 2;
                this.setData({ data_list: temp_data_list });
              }

              // 跳转支付页面
              my.navigateTo({
                url: '/pages/paytips/paytips?code=' + res.resultCode + '&result=' + res.result
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




});
