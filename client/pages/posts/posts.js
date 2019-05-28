// client/pages/allPost/allPost.js
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starPostsKey:'starPostsKey',
    rssSourcesKey:'rssSourcesKey',


    // -----------这部分是属于样式的OPEN---------------
    skin: "skin-grey",
    bkColor: "rgb(64, 63, 60)",
    navBkColor: "#403f3c",
    tabbarIconStateNum: [0, 1, 0],
    tabbarIconState: ["star", "browsing-history", "coupon"], // 0, 1, 2
    pageHeight: 2000,
    // -----------这部分是属于样式的CLOSE---------------

    showModal: false, // 对话窗
    skinShowModal: false,
    loadShowModal: false,
    
    hasReadPosts:[],
    starPosts: [],
    allPosts: [],
    newPosts:[],

    showPosts:[],
    rssSources: [],
    lastTime: "",
    segment:0,
    newRssSource:{},
    isGetting:false,

    bottomIndex:1,
    leftString:'收藏',
    rightString:'已读',

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
  
  /**
   * 收藏新博文
   */
  addStar(tempIndex) {
    let that = this;
    let hasStared = false;
    let tempPostId = that.data.showPosts[tempIndex].postId;
    let i = 0;
    for (i; i < that.data.starPosts.length; i++) {
      if (that.data.starPosts[i].postId == tempPostId) {
        hasStared = true;
        break;
      }
    }
    if (hasStared) {
      console.log('quxiaoshoucang',i)
      that.cancelStar(i);
    }
    else {
      console.log('界面', that.data.bottomIndex, '收藏')
      that.data.starPosts.push(that.data.showPosts[tempIndex]);
      that.setData({
        starPosts: that.data.starPosts
      })
      wx.setStorageSync(that.data.starPostsKey, that.data.starPosts);
      wx.showToast({
        title: '收藏成功！',
        icon: 'none',
      })
    }
  },

  cancelStar(tempIndex){
    let that = this;
    let i = 0;
    let tempStarPosts = [];
    for(i;i<that.data.starPosts.length;i++){
      if(i == tempIndex){
        continue
      }
      tempStarPosts.push(that.data.starPosts[i]);
    };
    that.setData({
      starPosts:tempStarPosts
    });
    wx.setStorageSync(that.data.starPostsKey, that.data.starPosts)
    if(that.data.bottomIndex==0){
      that.setData({
        showPosts:that.data.starPosts
      });
    }
    console.log('界面',that.data.bottomIndex,'取消收藏',tempIndex)
    console.log(that.data.starPosts)
    wx.showToast({
      title: '取消收藏!',
      icon:'none'
    })
  },

  onSlidePost(event) {
    let that = this;
    let tempIndex = event.currentTarget.id;
    let position = event.detail.position;
    // const { position, instance } = event.detail;
    console.log("onclose ", event);
    switch (position) {
      case 'left':
        if(that.data.bottomIndex==1){
          that.addStar(tempIndex);
        }
        else if (that.data.bottomIndex==0){
          that.cancelStar(tempIndex);
        }
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

  onSlideBlog(event) {
    let that = this;
    let tempIndex = event.currentTarget.id;
    let position = event.detail.position;
    // const { position, instance } = event.detail;
    console.log("onclose ", event);
    switch (position) {
      case 'left':
        // let onePost = t
        // that.addStar(onePost);
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

  // ----------------修改皮肤OPEN----------------
  chooseBlackTheme: function(event) {

    var app = getApp();

    app.globalData.skin = "skin-black";
    app.globalData.navBkColor = "#000000";
    app.globalData.bkColor = "#000000";
    app.globalData.rssFormLogo = "https://user-images.githubusercontent.com/31076337/58367987-bd193800-7f18-11e9-8abc-02edac1d76ee.png";

    this.skinHideModal();

    this.onShow();



  },

  chooseGreyTheme: function(event) {

    var app = getApp();

    app.globalData.skin = "skin-grey";
    app.globalData.navBkColor = "#403f3c";
    app.globalData.bkColor = "rgb(64, 63, 60)";
    app.globalData.rssFormLogo = "https://user-images.githubusercontent.com/31076337/58075941-80c59f00-7bdb-11e9-86c0-6c6b8b2de3f7.png";

    this.skinHideModal();

    this.onShow();


  },
  // ----------------修改皮肤CLOSE----------------

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

  skinHideModal: function () {

    this.setData({

      skinShowModal: false

    });

  },

  skinShowModal: function () {
    this.setData({
          skinShowModal: true
        }

    );
  },

  loadHideModal: function() {
    this.setData({
      loadShowModal: false
    });
  },

  loadShowModal: function() {
    this.setData({
      loadShowModal: true
    });
  },
  // -------------------------对话窗CLOSE-------------------------


  onClick(event) {
    if(event.detail.index === 0){
      if (this.data.isGetting) {
        // wx.showLoading({
        //   title: '正在更新博文...',
        // });
        this.loadShowModal()
      }
      this.setData({
        idx: true
      })
    }
    else{
      // wx.hideLoading();
      this.loadHideModal();
      this.setData({
        idx: false
      })
    }
  },

  goToArticle: function (event) {
    let tempIndex = event.currentTarget.id;
    let tempPost = this.data.showPosts[tempIndex]
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
   * 获取博文
   */
  getPosts(that){
    that.setData({
      isGetting:true
    });
    if(that.data.idx){
      // wx.showLoading({
      //   title: '正在更新博文',
      // });
      that.loadShowModal();
    }
    console.log("gengxin")
    wx.request({
      url: 'https://nkurss.potatobrother.cn/rssread/newPosts',
      method: 'GET',
      data: {
        rssSources: that.data.rssSources,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.newPosts) {
          that.setData({
            newPosts: res.data.newPosts,
            showPosts: res.data.newPosts
          })
          console.log("success");
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '更新失败，请检查网络!',
          icon:'none'
        })
      },
      complete(){
        // wx.hideLoading();
        that.loadHideModal();
        that.setData({
          isGetting: false
        });
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

    that.data.rssSources = wx.getStorageSync(that.data.rssSourcesKey);
    that.data.starPosts = wx.getStorageSync(that.data.starPostsKey);
    if(that.data.starPosts.length == 0){
      that.data.starPosts=[]; 
    } 
    if (that.data.rssSources.length == 0) {
      that.data.rssSources = [];
      let oneRssSource={
        rssUrl:'https://zhihu.com/rss',
        rssName:'知乎精选'
      }
      that.data.rssSources.push(oneRssSource);
    }
    that.setData({
      starPosts:that.data.starPosts,
      rssSources:that.data.rssSources
    })
    wx.setStorageSync(that.data.starPostsKey, that.data.starPosts);
    wx.setStorageSync(that.data.rssSourcesKey, that.data.rssSources);
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
      wx.setStorageSync(that.data.rssSourcesKey,that.data.rssSources);
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
    // ------------
    // wx.hideLoading();
    that.loadHideModal();
    that.setData({
      bottomIndex:0,
      showPosts:that.data.starPosts
    });
    console.log("bottom ", that.data.bottomIndex)

  },

  clickBrowse: function() {
    let that = this;
    that.data.tabbarIconStateNum = [0, 1, 0];
    that.setTabbarState();
    // ------------
    if(that.data.isGetting){
      // wx.showLoading({
      //   title: '正在更新博文',
      // });

      that.loadShowModal();

    }
    that.setData({
      bottomIndex:1,
      showPosts:that.data.newPosts
    });
    console.log("bottom ",that.data.bottomIndex)
  },

  clickCoupon: function() {
    let that = this;
    that.data.tabbarIconStateNum = [0, 0, 1];
    that.setTabbarState();
    // ------------
    that.setData({
      bottomIndex:2,
      showPosts: that.data.allPosts
    });
    console.log("bottom ", that.data.bottomIndex)

  },
})