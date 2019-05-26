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
    var that = this;

    var activeIndex = 0;

    for(var i = 0; i < 3; i++) {
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

  onChange(event) {
    console.log("onchange ",event);
  },
  
  onClose(event) {
    let that= this;
    const { position, instance } = event.detail;
    console.log("onclose ",event);
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
        // wx.setStorageSync('key','one');
        const getinfo = wx.getStorageSync('key');
        if(getinfo){
          console.log('get ',getinfo);
        }
        else{
          console.log('nothing');
        }
        wx.showModal({
          title: '提示',
          content: '模态弹窗',
          success: function (res) {
              if (res.confirm) {
                  console.log('用户点击确定');
                  instance.close();
              }else{
                 console.log('用户点击取消');
              }

          }
        })
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
      if(that.data.starPosts[i][1] == onePost[1]){
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
    // console.log(that.data.starPosts);
  },

  addSource(oneRssSource){
    let that = this;
    that.data.rssSources.push(oneRssSource);
    wx.setStorageSync('rssSourcesKey', that.data.rssSources);
    that.setData({
      rssSources: that.data.rssSources
    })
  },


  goToArticle: function(event){
    let tempIndex = event.currentTarget.id;
    // let stringPost = JSON.stringify(that.data.allPosts[tempIndex])
    let tempPost = this.data.allPosts[tempIndex]
    console.log(tempPost)
    console.log(this.data.allPosts[tempIndex])
    wx.navigateTo({
      url: '../article/article?rssUrl='+tempPost.summary_detail.base+'&postId='+tempPost.id,
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

    var app = getApp();
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
    if(!that.data.starPosts){
      that.data.starPosts=[]; 
    } 
    if (that.data.rssSources.length == 0) {
      that.data.rssSources = [];
      let oneRssSource = {
        rssUrl: 'https://zhihu.com/rss',
        rssName: '源名称',
        rssDescribe: '源描述',
        rssLogo: '源logo',
        webUrl: '源网址'
      };
      that.data.rssSources.push(oneRssSource); 
    }
    that.setData({
      starPosts:that.data.starPosts,
      rssSources:that.data.rssSources
    })
    wx.setStorageSync('starPostsKey', that.data.starPosts);
    wx.setStorageSync('rssSourcesKey', that.data.rssSources);


    // console.log("rsssources ",that.data.rssSources);
    // console.log("starPosts ",that.data.starPosts);
    // console.log("allposts ",that.data.allPosts);
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
    var that = this;

    // --------------------换肤用OPEN----------------
    var app = getApp();
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
      wx.setStorage({
        key: 'rssSourcesKey',
        data: that.data.rssSources,
      });
      that.setData({
        newRssSource:{}
      });
    }

    wx.request({
      url: 'http://nkurss.potatobrother.cn:8080/rssread/rssread1',
      method: 'GET',
      data: {
        rssSources: that.data.rssSources,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.posts) {
          that.setData({
            allPosts: res.data.posts
          })
          console.log("success");
        }
      },
      fail: function (res) {
        console.log('fail');
      }
    })
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

    var that = this;

    that.data.tabbarIconStateNum = [1, 0, 0];

    that.setTabbarState();
  },

  clickBrowse: function() {

    var that = this;

    that.data.tabbarIconStateNum = [0, 1, 0];

    that.setTabbarState();
  },

  clickCoupon: function() {

    var that = this;

    that.data.tabbarIconStateNum = [0, 0, 1];

    that.setTabbarState();
  },



})