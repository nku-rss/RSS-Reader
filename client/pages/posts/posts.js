// client/pages/allPost/allPost.js
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // -----------这部分是属于样式的OPEN---------------
    skin: "skin-grey",
    bkColor: "rgb(64, 63, 60)",
    navBkColor: "#403f3c",
    tabbarIconStateNum: [0, 1, 0],
    tabbarIconState: ["star", "browsing-history", "coupon"], // 0, 1, 2
    // -----------这部分是属于样式的CLOSE---------------

    showModal: false, // 对话窗
    
    starPosts: [],
    rssSources: [],
    lastTime: "",
    allPosts:[],
    segment:0,
    newRssSource:{},


    active: 0,
    idx: true,
    icon: {
      normal: '//img.yzcdn.cn/icon-normal.png',
      active: '//img.yzcdn.cn/icon-active.png'
    }
  },


  setTabbarState() {
    let that = this;
    let activeIndex = 0;
    for(let i = 0; i < 3; i++) {
      if(that.data.tabbarIconStateNum[i] == 1) {
        activeIndex = i;
      }
    }
    if(activeIndex === 0) {
      this.setData({
        tabbarIconState: ["star", "browsing-history-o", "coupon-o"]
      })
    } else if(activeIndex === 1) {
      this.setData({
        tabbarIconState: ["star-o", "browsing-history", "coupon-o"]
      })
    } else if(activeIndex === 2) {
      this.setData({
        tabbarIconState: ["star-o", "browsing-history-o", "coupon"]
      })
    }
  },
  
  onSlidePost(event) {
    let that= this;
    const { position, instance } = event.detail;
    console.log("onclose ", event, " --- ",event.currentTarget.dataset.info);
    switch (position) {
      case 'left':
        let onePost = {
          rssUrl:"rssyuandishi",
          postId: event.currentTarget.dataset.info
        };
        that.addStar(onePost);
      case 'cell':
        break;
      case 'right':
        const getinfo = wx.getStorageSync('key');
        if(getinfo){
          console.log('get ',getinfo);
        }
        else{
          console.log('nothing');
        }



        break;
    }
  },

  // -------------------------对话窗OPEN-------------------------
  showModal: function () {

    this.setData({

      showModal: true

    })

  },

  hideModal: function () {

    this.setData({

      showModal: false

    });

  },
  onCancel: function () {

    this.hideModal();

  },

  onConfirm: function () {

    this.hideModal();

  },

  // -------------------------对话窗CLOSE-------------------------

  onSlideBlog(event) {
    let that = this;
    const { position, instance } = event.detail;
    console.log("onclose ", event);
    switch (position) {
      case 'left':
        let onePost = {
          rssUrl: "rssyuandishi",
          postId: event.currentTarget.dataset.info
        };
        that.addStar(onePost);
      case 'cell':
        break;
      case 'right':
        const getinfo = wx.getStorageSync('key');
        if (getinfo) {
          console.log('get ', getinfo);
        }
        else {
          console.log('nothing');
        }

        that.showModal();

        break;
    }
  },
  onClick(event) {
    if(event.detail.index === 0){
      this.setData({
        idx: true
      })
    }
    else{
      this.setData({
        idx: false
      })
    }
  },

  goToArticle: function (event) {
    let tempIndex = event.currentTarget.id;
    let tempPost = this.data.allPosts[tempIndex]
    console.log("toarticle ",tempPost)
    wx.navigateTo({
      url: '../article/article?rssUrl=' + tempPost.rssUrl + '&postId=' + tempPost.postId,
    })
  },

  goToEdit() {
    wx.navigateTo({
      url: '/pages/edit/edit',
    })
  },

  goToTheme() {
    wx.navigateTo({
      url: '/pages/theme/theme',
    })
  },

  /**
   * 收藏新博文
   */
  addStar(onePost){
    let that = this;
    let hasStared = false;
    for(let i =0;i<that.data.starPosts.length;i++){
      if(that.data.starPosts[i].postId == onePost.postId){
        hasStared = true;
        break;
      }
    }
    if(hasStared){
      wx.showToast({
        title: '此文章已经被收藏！',
        icon: 'none',
      })
    }
    else{
      that.data.starPosts.push(onePost);
      wx.setStorageSync('starPostsKey', that.data.starPosts);
      that.setData({
        starPosts: that.data.starPosts
      })
      wx.showToast({
        title: '收藏成功！',
        icon: 'none',
      })
    }
  },


  /**
   * 获取博文
   */
  getPosts(that){
    wx.showLoading({
      title: '正在更新博文...',
    })
    wx.request({
      url: 'https://nkurss.potatobrother.cn/rssread/allPosts',
      method: 'GET',
      data: {
        rssSources: that.data.rssSources,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.posts) {
          that.setData({
            allPosts: res.data.posts
          })
          console.log("success");
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '拉取失败，请检查网络!',
          icon:'none'
        })
      },
      complete(){
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    // 设置Tabbar
    that.setTabbarState();

    // --------------------换肤用OPEN----------------
    let app = getApp();
    // 设置navbar颜色
    wx.setNavigationBarColor( {
          frontColor: "#ffffff",
          backgroundColor: app.globalData.navBkColor,
        }
    );
    that.setData({
      skin: app.globalData.skin,
      bkColor: app.globalData.bkColor,
      navBkColor: app.globalData.navBkColor,
    });
    // --------------------换肤用CLOSE----------------

    that.data.rssSources = wx.getStorageSync('rssSourcesKey');
    that.data.starPosts = wx.getStorageSync('starPostsKey');
    if(that.data.starPosts.length == 0){
      that.data.starPosts=[]; 
    } 
    if (that.data.rssSources.length == 0) {
      that.data.rssSources = [];
    }
    that.setData({
      starPosts:that.data.starPosts,
      rssSources:that.data.rssSources
    })
    wx.setStorageSync('starPostsKey', that.data.starPosts);
    wx.setStorageSync('rssSourcesKey', that.data.rssSources);
    that.getPosts(that);
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let that = this;

    // --------------------换肤用OPEN----------------
    let app = getApp();
    // 设置navbar颜色
    wx.setNavigationBarColor( {
          frontColor: "#ffffff",
          backgroundColor: app.globalData.navBkColor,
        }
    );
    that.setData({
      skin: app.globalData.skin,
      bkColor: app.globalData.bkColor,
      navBkColor: app.globalData.navBkColor,
    });
    // --------------------换肤用CLOSE----------------
    
    if(JSON.stringify(that.data.newRssSource)!='{}'){
      that.data.rssSources.push(that.data.newRssSource);
      that.setData({
        rssSources:that.data.rssSources
      });
      wx.setStorageSync('rssSourcesKey',that.data.rssSources);
      that.setData({
        newRssSource:{}
      });
      that.getPosts(that);
    }   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  clickStar: function() {
    let that = this;
    that.data.tabbarIconStateNum = [1, 0, 0];
    that.setTabbarState();
  },

  clickBrowse: function() {
    let that = this;
    that.data.tabbarIconStateNum = [0, 1, 0];
    that.setTabbarState();
  },

  clickCoupon: function() {
    let that = this;
    that.data.tabbarIconStateNum = [0, 0, 1];
    that.setTabbarState();
  },
})