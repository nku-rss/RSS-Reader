// client/pages/allPost/allPost.js
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starPostsKey: 'starPostsKey',
    rssSourcesKey: 'rssSourcesKey',
    hasReadPostsKey: 'hasReadPostsKey',


    // -----------这部分是属于样式的OPEN---------------
    skin: "skin-grey",
    bkColor: "rgb(64, 63, 60)",
    navBkColor: "#403f3c",
    tabbarIconStateNum: [0, 1, 0],
    tabbarIconState: ["star", "browsing-history", "coupon"], // 0, 1, 2
    pageHeight: 2000,
    // -----------这部分是属于样式的CLOSE---------------
    
    toDeleteIndex: -1,
    toDeleteRssUrl: [],
    showModal: false, // 对话窗
    skinShowModal: false,
    loadShowModal: false,

    hasReadPosts:[],
    starPosts: [],
    allPosts: [],
    newPosts:[],
    showPosts:[],
    rssSources: [],
    newRssSource: {},
    isGetting: false,
    bottomIndex: 1,


    lastTime: "",
    segment:0,


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
      that.cancelStar(i);
    }
    else {
      that.data.starPosts.push(that.data.showPosts[tempIndex]);
      that.setData({
        starPosts: that.data.starPosts
      })
      wx.setStorageSync(that.data.starPostsKey, that.data.starPosts);
    }
  },

  cancelStar(tempIndex) {
    let that = this;
    let i = 0;
    //splice
    that.data.starPosts.splice(tempIndex, 1);
    that.setData({
      starPosts: that.data.starPosts
    });
    wx.setStorageSync(that.data.starPostsKey, that.data.starPosts)
    if (that.data.bottomIndex == 0) {
      that.setData({
        showPosts: that.data.starPosts
      });
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
        } else {
          that.addStar(tempIndex);
        }
        break;
      case 'cell':
        break;
      case 'right':
        if (that.data.bottomIndex == 1) {
          let tempSimplePost = {
            rssUrl:that.data.newPosts[tempIndex].rssUrl,
            postId:that.data.newPosts[tempIndex].postId
          };
          that.data.hasReadPosts.push(tempSimplePost);
          that.data.newPosts.splice(tempIndex, 1);
          that.setData({
            hasReadPosts: that.data.hasReadPosts,
            newPosts: that.data.newPosts,
            showPosts: that.data.newPosts
          });
          wx.setStorageSync(that.data.hasReadPostsKey, that.data.hasReadPosts);
        }
        break;
    }
    instance.close();
  },

  onSlideBlog(event) {
    let that = this;
    that.instanceClose();
    let tempIndex = event.currentTarget.id.replace('rssSources', '');
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        let tempRssSources = [];
        tempRssSources.push(that.data.rssSources[tempIndex]);
        for (let i = 0; i < that.data.rssSources.length; i++) {
          if (i != tempIndex) {
            tempRssSources.push(that.data.rssSources[i])
          }
        }
        that.setData({
          rssSources: tempRssSources
        });
        wx.setStorageSync(that.data.rssSourcesKey, that.data.rssSources);
        break;
      case 'cell':
        break;
      case 'right':
        that.showModal(tempIndex);
        break;
    }
    instance.close();
  },

  instanceClose(){
    let that=this;
    for(var i=0;i<that.data.showPosts.length;i++){
      let ins = that.selectComponent('#showPosts'+i);
      ins.close()
    }
    for(var i=0;i<that.data.rssSources.length;i++){
      let ins = that.selectComponent('#rssSources'+i);
      ins.close();
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
  showModal: function(tempIndex) {
    this.setData({
      showModal: true
    });
    this.setData({
      toDeleteIndex: tempIndex
    });
  },
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  onCancel: function() {
    this.hideModal();
    this.setData({
      toDeleteIndex: -1
    });
  },
  onConfirm: function() {
    this.hideModal();
    let that = this;
    let tempIndex = that.data.toDeleteIndex;
    if (that.data.toDeleteIndex >= 0) {
      that.data.toDeleteRssUrl.push(that.data.rssSources[tempIndex]);
      that.data.rssSources.splice(tempIndex, 1);
      that.setData({
        toDeleteIndex: -1,
        toDeleteRssUrl: that.data.toDeleteRssUrl,
        rssSources: that.data.rssSources
      })
      wx.setStorageSync(that.data.rssSourcesKey, that.data.rssSources)
    } else {
      wx.showToast({
        title: '出错，请重试！',
        icon: 'none'
      })
      that.setData({
        toDeleteIndex: -1
      })
    }
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
    let that = this;
    that.instanceClose();
    if (event.detail.index === 0) {
      if (that.data.isGetting) {
        // wx.showLoading({
        //   title: '正在更新博文...',
        // });
        this.loadShowModal()
      }
      if (that.data.toDeleteRssUrl.length != 0) {
        for (let i = 0; i < that.data.toDeleteRssUrl.length; i++) {
          let tempDeleteRssUrl = that.data.toDeleteRssUrl[i].rssUrl;
          var j = 0;
          for (j = 0; j < that.data.newPosts.length; j++) {
            if (that.data.newPosts[j].rssUrl == tempDeleteRssUrl) {
              that.data.newPosts.splice(j, 1);
              j--;
            }
          }
          for (j = 0; j < that.data.allPosts.length; j++) {
            if (that.data.allPosts[j].rssUrl == tempDeleteRssUrl) {
              that.data.allPosts.splice(j, 1);
              j--;
            }
          }
        }
        that.setData({
          allPosts: that.data.allPosts,
          newPosts: that.data.newPosts,
          showPosts: that.data.showPosts,
          toDeleteRssUrl: []
        })
      }
      that.setData({
        idx: true
      })

    } else {
      // wx.hideLoading();
      this.loadHideModal();
      this.setData({
        idx: false
      })
    }
  },

  goToArticle(event) {
    this.instanceClose();
    let tempIndex = event.currentTarget.id.replace('goToArticle','');
    let tempPost = this.data.showPosts[tempIndex];
    // wx.hideLoading();
    this.loadHideModal();
    wx.navigateTo({
      url: '../article/article?rssUrl=' + tempPost.rssUrl + '&postId=' + tempPost.postId,
    })
  },

  goToBlog(event) {
    this.instanceClose();
    let tempIndex = event.currentTarget.id.replace('goToBlog', '');
    let tempRssSource = this.data.rssSources[tempIndex];
    // wx.hideLoading();
    this.loadHideModal();
    wx.navigateTo({
      url: '../blog/blog?rssUrl=' + tempRssSource.rssUrl+'&rssName='+tempRssSource.rssName+'&rssLogo='+tempRssSource.rssLogo,
    })
  },


  goToEdit() {
    this.instanceClose();
    wx.navigateTo({
      url: '/pages/edit/edit',
    })
  },


  
  /**
   * 获取博文
   */
  getNewPosts(that){
    that.setData({
      isGetting:true
    });
    if(that.data.idx){
      // wx.showLoading({
      //   title: '正在更新博文',
      // });
      that.loadShowModal();
    }
    wx.request({
      url: 'https://nkurss.potatobrother.cn/rssread/newPosts',
      method: 'GET',
      data: {
        rssSources: that.data.rssSources,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.newPosts) {
          let tempAllPosts = [];
          for(let i=0;i<res.data.newPosts.length;i++){
            tempAllPosts.push(res.data.newPosts[i])
          }
          that.setData({
            allPosts:tempAllPosts,
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

    that.data.hasReadPosts = wx.getStorageSync(that.data.hasReadPostsKey);
    that.data.rssSources = wx.getStorageSync(that.data.rssSourcesKey);
    that.data.starPosts = wx.getStorageSync(that.data.starPostsKey);
    if(that.data.starPosts.length == 0){
      that.data.starPosts=[]; 
    } 
    if(that.data.hasReadPosts.length==0){
      that.data.hasReadPosts=[];
    }
    if (that.data.rssSources.length == 0) {
      that.data.rssSources = [];
      let oneRssSource = {
        rssUrl: 'https://zhihu.com/rss',
        rssName: '知乎精选',
        rssDescribe: 'describe',
        rssLogo: 'logo',
        webUrl:'url'
      }
      that.data.rssSources.push(oneRssSource);
    }
    that.setData({
      starPosts:that.data.starPosts,
      rssSources:that.data.rssSources,
      hasReadPosts:that.data.hasReadPosts
    })
    wx.setStorageSync(that.data.starPostsKey, that.data.starPosts);
    wx.setStorageSync(that.data.rssSourcesKey, that.data.rssSources);
    wx.setStorageSync(that.data.hasReadPostsKey, that.data.hasReadPosts);
    that.getNewPosts(that);
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
      that.getNewPosts(that);
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

  },
})