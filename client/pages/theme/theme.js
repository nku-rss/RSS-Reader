Page({

    data: {
        // ------样式设置OPEN-----
        skin: "skin-grey",
        bkColor: "rgb(64, 63, 60)",
        navBkColor: "#403f3c",
        rssFormLogo: "https://user-images.githubusercontent.com/31076337/58075941-80c59f00-7bdb-11e9-86c0-6c6b8b2de3f7.png",
        // ------样式设置CLOSE-----
    },

    chooseBlackTheme: function(event) {

        var app = getApp();

        app.globalData.skin = "skin-black";
        app.globalData.navBkColor = "#000000";
        app.globalData.bkColor = "#000000";
        app.globalData.rssFormLogo = "https://user-images.githubusercontent.com/31076337/58367987-bd193800-7f18-11e9-8abc-02edac1d76ee.png";

        wx.navigateBack({
            delta: 1,
        })

    },

    chooseGreyTheme: function(event) {

        var app = getApp();

        app.globalData.skin = "skin-grey";
        app.globalData.navBkColor = "#403f3c";
        app.globalData.bkColor = "rgb(64, 63, 60)";
        app.globalData.rssFormLogo = "https://user-images.githubusercontent.com/31076337/58075941-80c59f00-7bdb-11e9-86c0-6c6b8b2de3f7.png";

        wx.navigateBack({
            delta: 1,
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