Page({
  data: {
    starPostsKey:'starPostsKey',

    // ------样式设置OPEN-----
    skin: "skin-grey",
    bkColor: "rgb(64, 63, 60)",
    navBkColor: "#403f3c",
    // ------样式设置CLOSE-----

    loadShowModal: false,

    rssUrl:'',
    rssName:'',
    rssLogo:'',
    showPosts:[],
    starPosts:[],
    segment:1,
    
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

  instanceClose() {
    let that = this;
    for (var i = 0; i < that.data.showPosts.length; i++) {
      let ins = that.selectComponent('#showPosts' + i);
      ins.close()
    }
  },

  onSlidePost(event) {
    let that = this;
    that.instanceClose();
    let tempIndex = event.currentTarget.id.replace('showPosts', '');
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        if (that.data.bottomIndex == 0) {
          that.cancelStar(tempIndex);
        }
        else {
          that.addStar(tempIndex);
        }
      case 'cell':
        break;
      case 'right':
        break;
    }
    instance.close();
  },

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
      that.cancelStar(i);
    } 
    else {
      that.data.starPosts.push(that.data.showPosts[tempIndex]);
      let tempStarPosts = that.data.starPosts;
      let pages = getCurrentPages();
      let previousPage = pages[pages.length - 2];
      previousPage.setData({
        starPosts: tempStarPosts
      })
      that.setData({
        starPosts: tempStarPosts
      })
      wx.setStorageSync(that.data.starPostsKey, that.data.starPosts);
    }
  },

  cancelStar(tempIndex) {
    let that = this;
    that.data.starPosts.splice(tempIndex, 1);
    let tempStarPosts = that.data.starPosts;
    let pages = getCurrentPages();
    let previousPage = pages[pages.length - 2];
    previousPage.setData({
      starPosts: tempStarPosts
    })
    that.setData({
      starPosts: tempStarPosts
    })
    wx.setStorageSync(that.data.starPostsKey, that.data.starPosts);
    // wx.showToast({
    //   title: '取消收藏!',
    //   icon: 'none'
    // })
  },

  getPosts() {
    let that = this;
    // wx.showLoading({
    //   title: '正在更新博文',
    // });
    that.loadShowModal();
    wx.request({
      url: 'https://nkurss.potatobrother.cn/rssread/oneRssPosts',
      method: 'GET',
      data: {
        rssUrl: that.data.rssUrl,
        segment: that.data.segment
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.res && res.data.res!='error') {
          for (let i = 0; i < res.data.res.length; i++) {
            that.data.showPosts.push(res.data.res[i])
          }
          that.data.segment ++;
          that.setData({
            segment:that.data.segment,
            showPosts:that.data.showPosts
          })
          console.log("success get blog posts");
        }
        else{
          console.log("error get blog posts");
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '更新失败，请检查网络!',
          icon: 'none'
        })
        console.log("fail get blog posts");
      },
      complete() {
        // wx.hideLoading();
        that.loadHideModal();
      }
    })
  },

  goToArticle(event) {
    this.instanceClose();
    let tempIndex = event.currentTarget.id.replace('goToArticle', '');
    let tempPost = this.data.showPosts[tempIndex];
    wx.navigateTo({
      url: '../article/article?rssUrl=' + tempPost.rssUrl + '&postId=' + tempPost.postId,
    })
  },



  onLoad: function (options) {
// --------------------换肤用OPEN----------------
    var that = this;

    var app = getApp();
    // 设置navbar颜色
    wx.setNavigationBarColor( {
          frontColor: "#ffffff",
          backgroundColor: app.globalData.navBkColor,
        }
    )

    that.setData({
      skin: app.globalData.skin,
      bkColor: app.globalData.bkColor,
      navBkColor: app.globalData.navBkColor,
    })

    // --------------------换肤用CLOSE----------------

    that.data.starPosts = wx.getStorageSync(that.data.starPostsKey);
    that.setData({
      rssUrl:options.rssUrl,
      rssName:options.rssName,
      rssLogo:options.rssLogo,
      starPosts:that.data.starPosts
    })
    that.getPosts();
  },

  onShow: function (options) {

    // --------------------换肤用OPEN----------------

    var that = this;
    var app = getApp();
    // 设置navbar颜色
    wx.setNavigationBarColor( {
          frontColor: "#ffffff",
          backgroundColor: app.globalData.navBkColor,
        }
    )

    that.setData({
      segment:1,
      skin: app.globalData.skin,
      bkColor: app.globalData.bkColor,
      navBkColor: app.globalData.navBkColor,
    })

    // --------------------换肤用CLOSE----------------
  },
  
  onHide(){
    // wx.hideLoading();
    this.loadHideModal();
    this.instanceClose();
  }
});