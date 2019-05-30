const WxParse = require('../../wxParse/wxParse.js');  // 引入富文本转化库
const util = require('../../utils/util.js');          // 引入通用库

//index.js
//获取应用实例
const app = getApp();

// 富文本转化库依赖变量
const article = '';


Page({
  data: {

    // ------样式设置OPEN-----
    skin: "skin-grey",
    bkColor: "rgb(64, 63, 60)",
    navBkColor: "#403f3c",
    rssFormLogo: "https://user-images.githubusercontent.com/31076337/58075941-80c59f00-7bdb-11e9-86c0-6c6b8b2de3f7.png",
    // ------样式设置CLOSE-----

    postId: '',
    title: '',          // 文章标题
    author: '',         // 文章作者或源名称
    // favicon: '',        // 源logo
    // link: '',           // 原文链接
    rssUrl: '',         // rss源
    description: '',    // 原文内容
    // published: '',        // 更新日期

    // ----change published to time----
    time:'',
    // ----change close----

    nodes: article,     // 富文本转化变量
    showPopup: false,   // 链接提示弹框，由于个人开发者不具备webview的权限，如果读者想看更多内容，这里提供链接，需到浏览器访问
    linkSrc: '',        // 链接提示弹框的链接数据
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


    // 加载页面后，用跨页参数在缓存中查询出具体文字内容
    this.data.postId = options.postId;
    // this.data.favicon = options.favicon;
    this.data.rssUrl = options.rssUrl;
    // console.log("ssssss ",options)
    this.showDetail();
  },
  
  // 展示文章详情
  showDetail: function () {

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

    // const rssData = wx.getStorageSync('rssData') || {};
    // const author = rssData.title || '';
    wx.request({
      url:    'https://nkurss.potatobrother.cn/rssread/onePost',
      method: 'GET',
      data: {
        rssUrl: that.data.rssUrl,
        postId: that.data.postId
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log(res)
        var tempOnePost = res.data.onePost

        // ----remove useless value
        // var description_value
        // var index = 0

        console.log(tempOnePost)
        if (!tempOnePost) {
          console.log("no_matched_post")
        }
        else if(tempOnePost=="error_request"){
          console.log("error_request")
        }else{
          //----remove methods for handle the content----
          // if (tempOnePost.summary_detail != undefined){
          //   description_value = tempOnePost.summary_detail.value
          //   description_value.replace(/SRC/g,"src");
          // } else if (tempOnePost.content != undefined){
          //   // description_value = tempOnePost.content[0].value
          //   while (tempOnePost.content[index] != undefined) {
          //     description_value += tempOnePost.content[index].value
          //     index ++
          //   }
          // } else if (tempOnePost.description != undefined){
          //   description_value = tempOnePost.description
          // } else {
          //   description_value = tempOnePost.summary
          // }

          that.setData({
            title: tempOnePost.title,
            author: tempOnePost.author,

            //----change description and time value----
            
            description: tempOnePost.content,
            time: tempOnePost.time ? util.formatDate("yyyy-MM-dd HH:mm:ss", tempOnePost.time) : '',
            // description: description_value,
            // published: tempOnePost.published ? util.formatDate("yyyy-MM-dd HH:mm:ss", tempOnePost.published) : '',
            //----change close----
          })
          console.log("success");
          // 调用富文本转化方法 html
          WxParse.wxParse('article', 'html', that.data.description, that, 5);
        }
      },
      fail: function (res) {
        console.log('fail');
      },
      complete: function (res) {
        console.log('complete');
      }
    })
  },

  // 链接弹框显隐控制
  togglePopup: function () {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },

  // 富文本转化库中，添加的自定义绑定方法，当点击<a>标签时展示链接提示
  wxParseTagATap: function (event) {
    const linkSrc = event.currentTarget.dataset.src;
    // console.log(linkSrc);
    if (linkSrc) {
      this.setData({
        showPopup: true,
        linkSrc,
      });
    }
  }
})
