Page({
    chooseBlackTheme: function(event) {

        let pages = getCurrentPages();

        let prevPage = pages[ pages.length - 2 ];

        console.log(prevPage);

        prevPage.setData({
            skin: "skin-black",
            bkColor: "black",
            navBkColor: "#000000",
        });

        // setTimeout(function() {
        //     wx.navigateBack({
        //         delta: 1,
        //     })
        // }, 1500)

        wx.navigateBack({
            delta: 1,
        })

    },

    chooseGreyTheme: function(event) {

        let pages = getCurrentPages();

        let prevPage = pages[ pages.length - 2 ];

        console.log(prevPage);

        prevPage.setData({
            skin: "skin-grey",
            bkColor: "#403f3c",
            navBkColor: "#403f3c",
        });

        // setTimeout(function() {
        //     wx.navigateBack({
        //         delta: 1,
        //     })
        // }, 1500)

        wx.navigateBack({
            delta: 1,
        })

    }
});