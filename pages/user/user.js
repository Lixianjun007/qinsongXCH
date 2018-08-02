const app = getApp();
Page({
  data: {
    user : null,
    user_head_src: app.data.default_user_head_src,
    nav_items_list: [
      {
        icon: '/images/user-myorder.png',
        arrow: 'horizontal',
        title: '我的订单 My order',
        value: 'myorder',
        is_show: 1
      }
    ]
  },

  onLoad() {},

  /**
   * 页面显示
   */
  onShow()
  {
    // 标题设置
    my.setNavigationBar({title: '我的 My'});

    // 初始化
    this.user_init();
  },

  /**
   * 初始化
   */
  user_init()
  {
    var user = app.GetUserInfo(this, 'user_init');
    if(user != false)
    {
      this.setData({user: user, user_head_src: user.avatar});
    }
  },

  /**
   * 用户头像加载失败则加载本地默认图片
   */
  user_head_image_error(e)
  {
    this.setData({user_head_src: app.data.default_user_head_src});
  },

  /**
   * 导航事件
   */
  nav_item_event(e)
  {
    var value = e.target.dataset.value;
    switch(value)
    {
      // 我的订单
      case 'myorder':
        my.navigateTo({
          url: '/pages/myorder/myorder'
        });
        break;
    }
  },

  /**
   * 用户头像预览事件
   */
  user_head_event(e)
  {
    my.previewImage({
      current: 0,
      urls: [this.data.user_head_src]
    });
  }

});
