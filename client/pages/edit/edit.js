Page({
  data: {
    // ------样式设置OPEN-----
    skin: "skin-grey",
    bkColor: "rgb(64, 63, 60)",
    navBkColor: "#403f3c",
    rssFormLogo: "https://user-images.githubusercontent.com/31076337/58075941-80c59f00-7bdb-11e9-86c0-6c6b8b2de3f7.png",
    // ------样式设置CLOSE-----
    editSource: [], 
  },
  addTo:function(e) {
    let that = this;
    let newRssSource = {
      rssUrl: e.detail.value.rssUrl,
      rssName: e.detail.value.rssName,
      rssDescribe: e.detail.value.rssDecribe,
      rssLogo: e.detail.value.rssLogo,
      webUrl: e.detail.value.webUrl
    };
    console.log(newRssSource);
    console.log(e)
    if(!newRssSource.rssUrl){
      wx.showToast({
        title: '请输入RSS源！',
        icon:'none'
      })
    }
    else if(!newRssSource.rssName){
      wx.showToast({
        title: '请输入RSS名称！',
        icon: 'none'
      })
    }
    else{
      wx.showLoading({
        title: '正在添加RSS...',
      });
      wx.request({
        url: 'https://nkurss.potatobrother.cn/rssread/testRssSource',
        data:{
          rssUrl:newRssSource.rssUrl
        },
        success(res){
          wx.hideLoading();
          if(res.data.test=='error'){
            wx.showToast({
              title: 'RSS源地址有误！',
              icon :'none'
            })
          }
          else{
            let pages = getCurrentPages();
            let previousPage = pages[pages.length - 2];
            previousPage.setData({
              newRssSource: newRssSource
            })
            wx.navigateBack({
              delta: 1,
              success() {
                wx.showToast({
                  title: "添加成功！",
                })
              }
            })
          }
        },
        complete(){
          wx.hideLoading();
        }
      })
    } 
  },
  addCancel:function(e) {
    wx.navigateBack({
      delta:1
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
      rssFormLogo: app.globalData.rssFormLogo
    })

    // --------------------换肤用CLOSE----------------
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
      skin: app.globalData.skin,
      bkColor: app.globalData.bkColor,
      navBkColor: app.globalData.navBkColor,
      rssFormLogo: app.globalData.rssFormLogo
    })

    // --------------------换肤用CLOSE----------------
  }
});