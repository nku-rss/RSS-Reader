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
    var that = this;
    var editSource = [];
    editSource[0] = e.detail.value.address;
    editSource[1] = e.detail.value.name;
    editSource[2] = e.detail.value.decribe;
    editSource[3] = e.detail.value.logo;
    editSource[4] = e.detail.value.source;
  },
  addCancel:function(e) {
    wx.redirectTo({
      url: '/pages/article/article'
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