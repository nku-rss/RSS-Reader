// client/pages/allPost/allPost.js
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skin: "skin-grey",
    bkColor: "rgb(64, 63, 60)",
    
    starPosts: [],
    rssSources: [],
    lastTime: "",
    allPosts:[],
    segment:0,


    active: 0,
    idx: true,
    icon: {
      normal: '//img.yzcdn.cn/icon-normal.png',
      active: '//img.yzcdn.cn/icon-active.png'
    }
  },

  onChange(event) {
    console.log(event.detail);
  },
  
  onClose(event) {
    let that= this;
    const { position, instance } = event.detail;
    console.log(position,'  ',instance);
    switch (position) {
      case 'left':

        let onePost = {
          rssUrl:"rssyuandishi",
          index: event.currentTarget.dataset.info
        };

        that.addStar(onePost);

      case 'cell':
        instance.close();
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
                  console.log('用户点击确定')
                  instance.close();
              }else{
                 console.log('用户点击取消')
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
    console.log(that.data.starPosts);
  },

  addSource(oneRssSource){
    let that = this;
    that.data.rssSources.push(oneRssSource);
    wx.setStorageSync('rssSourcesKey', that.data.rssSources);
    that.setData({
      rssSources: that.data.rssSources
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.data.rssSources = wx.getStorageSync('rssSourcesKey');
    that.data.starPosts = wx.getStorageSync('starPostsKey');
    wx.request({
      url:'http://nkurss.potatobrother.cn:8080/rssread/rssread1',
      method: 'GET',
      data: {
        rssSources:that.data.rssSources,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if(res.data.articles){
          that.setData({
            allPosts: res.data.posts
          })
          console.log("success");
        }
        console.log(that.data.allPosts)
      },
      fail: function (res) {
        console.log('fail');
      },
      complete: function (res) {
        console.log('complete');
      }
    })

    if(!that.data.starPosts){
      that.data.starPosts=[]; 
    } 
    if (!that.data.rssSources) {
      that.data.rssSources = [];
      let oneRssSource = {
        rssUrl: 'https://zhihu.com/rss',
        rssName: '源名称' + i,
        rssDescribe: '源描述' + i,
        rssLogo: '源logo' + i,
        webUrl: '源网址' + i
      };
      that.data.rssSources.push(oneRssSource); 
    }
    that.setData({
      starPosts:that.data.starPosts,
      rssSources:that.data.rssSources
    })
    wx.setStorageSync('starPostsKey', that.data.starPosts)
    wx.setStorageSync('rssSourcesKey', that.data.rssSources)

  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})