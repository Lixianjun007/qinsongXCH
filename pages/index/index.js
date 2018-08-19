const app = getApp();
Page({
  data: {
    department_all: app.department_all,
      //concession, house miscellaneous, gallery=>galley
    department_index: -1,
    ship_all: app.ship_all,
    ship_index: 0,
    courier_is_show: 0,
    switch_list: [
      { name: '物品名称 name', type: 'name', active: 'switch-active' },
      { name: '物品重量 weight', type: 'kg', active: '' }
    ],
    courier_goods_all: [
      { name: '文件 file', active: '' },
      { name: '食品 food', active: '' },
      { name: '服饰 dress', active: '' },
      { name: '生活 life', active: '' },
      { name: '数码 digit', active: '' },
      { name: '其它 other', active: '' }
    ],
    courier_kg_all: [
      { name: '1', active: '' },
      { name: '1.5', active: '' },
      { name: '2', active: '' },
      { name: '2.5', active: '' },
      { name: '3', active: '' },
      { name: '其它 other', active: '' },
    ],
    courier_data: [],
    is_show_goods_name: 1,
    is_show_goods_kg: 0,
    is_show_goods_name_other: 0,
    is_show_goods_kg_other: 0,
    courier_number_input_focus: false,
    courier_number_value: '',
    courier_goods_name_value: '',
    courier_goods_kg_value: '',
    courier_goods_name_other_input_value: '',
    courier_goods_kg_other_input_value: '',
    form_submit_loading: false,
    total_price: 0.00,
    receives_cn_data: { address: "上海市嘉定区南翔镇纬五路228号6号楼107室 冀通物流", mobile: "+8615021617092" },
    receives_en_data: { address: "228 WeiWu Road, Building 6, Room 107, JiaDing District, Shanghai, China  Yi Tong logistic", mobile: "+8615021617092" },
    name: '',
    mobile: '',
    remarks: '',
  },

  /**
   * 初始化
   */
  onLoad() {
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
    var kg = parseFloat(0);
    var courier_data = this.data.courier_data;
    var total_price = parseFloat(0);
    for (var i in courier_data) {
      kg = parseFloat(courier_data[i]['kg']);
      // console.log(kg);  //调试用
      total_price += parseFloat(app.price_two_decimal(8+(kg-1)*6));    //lxj
    }
    

    // console.log(courier_data[0]);
    if (courier_data[0] == null) {   //lxj
      this.setData({ total_price: 0.00 });
    } else {
      this.setData({ total_price: (total_price < 8) ? '8.00' : total_price });
    }

    // 窗口数据初始化
    this.courier_view_init();
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

    var temp_courier_goods_all = this.data.courier_goods_all;
    for (var i in temp_courier_goods_all) {
      temp_courier_goods_all[i]['active'] = '';
    }

    var temp_courier_kg_all = this.data.courier_kg_all;
    for (var i in temp_courier_kg_all) {
      temp_courier_kg_all[i]['active'] = '';
    }

    this.setData({
      switch_list: temp_switch_list,
      courier_goods_all: temp_courier_goods_all,
      courier_kg_all: temp_courier_kg_all,
      is_show_goods_name: 1,
      is_show_goods_kg: 0,
      is_show_goods_name_other: 0,
      is_show_goods_kg_other: 0,
      courier_number_input_focus: false,
      courier_number_value: '',
      courier_goods_name_value: '',
      courier_goods_kg_value: '',
      courier_goods_name_other_input_value: '',
      courier_goods_kg_other_input_value: '',
    });
  },

  /**
   * 导航切换事件
   */
  switch_submit_event(e) {
    // 导航处理
    var type = e.target.dataset.type;
    var temp_switch_list = this.data.switch_list;
    for (var i in temp_switch_list) {
      if (temp_switch_list[i]['type'] == type) {
        temp_switch_list[i]['active'] = 'switch-active';
      } else {
        temp_switch_list[i]['active'] = '';
      }
    }

    this.setData({
      switch_list: temp_switch_list,
      is_show_goods_name: (type == 'name') ? 1 : 0,
      is_show_goods_kg: (type == 'kg') ? 1 : 0,
    });
  },

  /**
 * 单号失去焦点事件
 */
  courier_number_blur_input(e) {
    // 焦点值关闭
    this.setData({ courier_number_input_focus: false });

    // 是否单号信息和名称和重量都已经选择
    this.courier_push('none');
  },

  /**
   * 单号输入事件同步
   */
  courier_number_input(e) {
    this.setData({ courier_number_value: e.detail.value });
  },

  /**
   * 物品名称其它输入事件同步
   */
  courier_goods_name_other_input(e) {
    this.setData({ courier_goods_name_other_input_value: e.detail.value });
  },

  /**
   * 物品重量其它输入事件同步
   */
  courier_goods_kg_other_input(e) {
    this.setData({ courier_goods_kg_other_input_value: e.detail.value });
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
    this.setData({ mobile: e.detail.value });
  },

  /**
   * 授权事件同步
   */
  agreement_event(e) {
    console.log()
    this.setData({ is_agreement: (e.detail.value.length > 0) });
  },

  /**
   * 单号信息添加
   */
  courier_push(type) {
    if (this.data.courier_goods_name_value.length > 0 && this.data.courier_goods_kg_value.length > 0) {
      if (this.data.courier_number_value.length > 0) {
        var temp_courier_data = this.data.courier_data;
        temp_courier_data.push({ number: this.data.courier_number_value, goods: this.data.courier_goods_name_value, kg: this.data.courier_goods_kg_value });
        this.setData({
          courier_data: temp_courier_data,
          courier_is_show: 0
        });

        // 总价计算
        this.courier_data_kg_price();
      } else {
        if (type == 'submit') {
          my.showToast({
            type: 'fail',
            content: '请填写快递单号 Please fill in the delivery'
          });
          this.setData({ courier_number_input_focus: true });
        } else if (type != 'none') {
          my.showToast({
            type: 'none',
            content: '请填写快递单号 Please fill in the delivery'
          });
        }
      }
    }
  },

  /**
   * 物品名称选择
   */
  courier_goods_submit_event(e) {
    var index = parseInt(e.target.dataset.value);
    var temp_courier_goods_all = this.data.courier_goods_all;
    var count = temp_courier_goods_all.length;
    var temp_switch_list = this.data.switch_list;
    if (!temp_courier_goods_all.hasOwnProperty(index)) {
      my.showToast({
        type: 'fail',
        content: '选项有误 select error'
      });
      return false;
    } else {
      for (var i in temp_courier_goods_all) {
        if (index == i) {
          temp_courier_goods_all[i]['active'] = 'courier-active';
        } else {
          temp_courier_goods_all[i]['active'] = '';
        }
      }
    }

    if (index + 1 == count) {
      temp_switch_list[0]['active'] = 'switch-active';
      temp_switch_list[1]['active'] = '';
      var is_show_goods_name_other = 1;
      var courier_goods_name_value = '';
      var is_show_goods_name = 1;
      var is_show_goods_kg = 0;
    } else {
      temp_switch_list[0]['active'] = (this.data.courier_goods_kg_value.length == 0) ? '' : 'switch-active';
      temp_switch_list[1]['active'] = (this.data.courier_goods_kg_value.length == 0) ? 'switch-active' : '';
      var is_show_goods_name_other = 0;
      var courier_goods_name_value = temp_courier_goods_all[index]['name'];
      var is_show_goods_name = (this.data.courier_goods_kg_value.length == 0) ? 0 : 1;
      var is_show_goods_kg = (this.data.courier_goods_kg_value.length == 0) ? 1 : 0;
    }

    this.setData({
      is_show_goods_name_other: is_show_goods_name_other,
      courier_goods_name_value: courier_goods_name_value,
      courier_goods_all: temp_courier_goods_all,
      is_show_goods_name: is_show_goods_name,
      is_show_goods_kg: is_show_goods_kg,
      switch_list: temp_switch_list
    });

    // 是否单号信息和名称和重量都已经选择
    this.courier_push();
  },

  /**
   * 物品名称其它确认
   */
  courier_goods_name_other_submit_event(e) {
    if (this.data.courier_goods_name_other_input_value.length > 0) {
      var temp_switch_list = this.data.switch_list;
      if (this.data.courier_goods_kg_value.length == 0) {
        temp_switch_list[0]['active'] = '';
        temp_switch_list[1]['active'] = 'switch-active';
      }
      this.setData({
        switch_list: temp_switch_list,
        courier_goods_name_value: this.data.courier_goods_name_other_input_value,
        is_show_goods_name: (this.data.courier_goods_kg_value.length == 0) ? 0 : 1,
        is_show_goods_kg: (this.data.courier_goods_kg_value.length == 0) ? 1 : 0,
      });

      // 是否单号信息和名称和重量都已经选择
      this.courier_push('submit');
    } else {
      my.showToast({
        type: 'fail',
        content: '请填写物品描述 Item description'
      });
    }
  },


  /**
 * 物品重量选择
 */
  courier_kg_submit_event(e) {
    var index = parseInt(e.target.dataset.value);
    var temp_courier_kg_all = this.data.courier_kg_all;
    var count = temp_courier_kg_all.length;
    var temp_switch_list = this.data.switch_list;
    if (!temp_courier_kg_all.hasOwnProperty(index)) {
      my.showToast({
        type: 'fail',
        content: '选项有误 select error'
      });
      return false;
    } else {
      for (var i in temp_courier_kg_all) {
        if (index == i) {
          temp_courier_kg_all[i]['active'] = 'courier-active';
        } else {
          temp_courier_kg_all[i]['active'] = '';
        }
      }
    }

    if (index + 1 == count) {
      temp_switch_list[0]['active'] = '';
      temp_switch_list[1]['active'] = 'switch-active';
      var is_show_goods_kg_other = 1;
      var courier_goods_kg_value = '';
      var is_show_goods_name = 0;
      var is_show_goods_kg = 1;
    } else {
      temp_switch_list[0]['active'] = '';
      temp_switch_list[1]['active'] = 'switch-active';
      var is_show_goods_kg_other = 0;
      var courier_goods_kg_value = temp_courier_kg_all[index]['name'];
      var is_show_goods_kg = (this.data.courier_goods_name_value.length == 0) ? 0 : 1;
      var is_show_goods_name = (this.data.courier_goods_name_value.length == 0) ? 1 : 0;
    }

    this.setData({
      is_show_goods_kg_other: is_show_goods_kg_other,
      courier_goods_kg_value: courier_goods_kg_value,
      courier_kg_all: temp_courier_kg_all,
      is_show_goods_name: is_show_goods_name,
      is_show_goods_kg: is_show_goods_kg,
      switch_list: temp_switch_list
    });

    // 是否单号信息和名称和重量都已经选择
    this.courier_push();
  },

  /**
   * 物品重量其它确认
   */
  courier_goods_kg_other_submit_event(e) {
    if (this.data.courier_goods_kg_other_input_value.length > 0) {
      var temp_switch_list = this.data.switch_list;
      if (this.data.courier_goods_name_value.length == 0) {
        temp_switch_list[0]['active'] = 'switch-active';
        temp_switch_list[1]['active'] = '';
      }

      this.setData({
        switch_list: temp_switch_list,
        courier_goods_kg_value: this.data.courier_goods_kg_other_input_value,
        is_show_goods_kg: (this.data.courier_goods_name_value.length == 0) ? 0 : 1,
        is_show_goods_name: (this.data.courier_goods_name_value.length == 0) ? 1 : 0,
      });

      // 是否单号信息和名称和重量都已经选择
      this.courier_push('submit');
    } else {
      my.showToast({
        type: 'fail',
        content: '请填写物品重量 Weight of goods'
      });
    }
  },

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

    // 表单数据
    var form_data = e.detail.value;
    console.log(form_data);
    form_data['courier'] = this.data.courier_data.length == 0 ? '' : JSON.stringify(this.data.courier_data);

    // 数据校验
    var validation = [
      { fields: 'name', msg: '请填写姓名 Please fill in your name' },
      { fields: 'mobile_phone', msg: '请填写联系电话 Please fill incontact number' },
      { fields: 'department', msg: '请选择部门 Please select the department' },
      { fields: 'ship', msg: '请选择船号 Please select the Owned ship' },
      { fields: 'courier', msg: '请添加单号信息 Please add express message' },
      { fields: 'is_agreement', msg: '请同意授权协议 Please agree to the Registration Policy' }
    ];
    if (app.fields_check(form_data, validation)) {
      // 加载loding
      my.showLoading({ content: '处理中 loading...' });
      this.setData({ form_submit_loading: true });

      // 获取店铺数据
      my.httpRequest({
        url: app.get_request_url('Add', 'Order'),
        method: 'POST',
        data: form_data,
        dataType: 'json',
        success: (res) => {
          my.hideLoading();
          if (res.data.code == 0) {
            my.showToast({
              type: 'success',
              content: res.data.msg
            });
            setTimeout(function () {
              $this.form_reset();
              my.navigateTo({
                url: '/pages/myorder/myorder'
              });
            }, 1000);
          } else {
            this.setData({ form_submit_loading: false });
            my.showToast({
              type: 'fail',
              content: res.data.msg
            });
          }
        },
        fail: () => {
          my.hideLoading();
          this.setData({ form_submit_loading: false });

          my.showToast({
            type: 'fail',
            content: '服务器请求出错 service error'
          });
        }
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
      ship_index: 0,
      courier_data: [],
      name: '',
      mobile: '',
      is_agreement: false,
    });
  },

  /**
   * 收件信息拷贝
   */
  receives_data_copy_event(e) {
    var type = e.target.dataset.type;
    var field = e.target.dataset.field;
    var data = (type == 'cn') ? this.data.receives_cn_data : this.data.receives_en_data;
    my.setClipboard({
      text: data[field],
      success: () => {
        my.showToast({ content: '复制成功' });
      },
      fail: () => {
        my.showToast({ content: '复制失败' });
      }
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

});
