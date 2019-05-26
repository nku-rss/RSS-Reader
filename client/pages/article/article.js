const WxParse = require('../../wxParse/wxParse.js');  // 引入富文本转化库
const util = require('../../utils/util.js');          // 引入通用库

//index.js
//获取应用实例
const app = getApp();

// 富文本转化库依赖变量
const article = '';


Page({
  data: {
    postId: '',
    title: '',          // 文章标题
    author: '',         // 文章作者或源名称
    favicon: '',        // 源logo
    link: '',           // 原文链接
    rssUrl: '',         // rss源
    description: '',    // 原文内容
    published: '',        // 更新日期
    nodes: article,     // 富文本转化变量
    showPopup: false,   // 链接提示弹框，由于个人开发者不具备webview的权限，如果读者想看更多内容，这里提供链接，需到浏览器访问
    linkSrc: '',        // 链接提示弹框的链接数据
  },
  onLoad: function (options) {
    // 加载页面后，用跨页参数在缓存中查询出具体文字内容
    this.data.postId = options.postId;
    // this.data.favicon = options.favicon;
    this.data.rssUrl = options.rssUrl;
    // console.log("ssssss ",options)
    this.showDetail();
  },

  // 展示文章详情
  showDetail: function () {
    // const rssData = wx.getStorageSync('rssData') || {};
    // const author = rssData.title || '';
    let that = this;
    wx.request({
      url:    'http://nkurss.potatobrother.cn:8080/rssread/onePost',
      method: 'GET',
      data: {
        rssUrl: that.data.rssUrl,
        postId: that.data.postId
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        var tempOnePost = res.data.onePost
        console.log(tempOnePost)
        if (!tempOnePost) {
          console.log("no_matched_post")
        }
        else if(tempOnePost=="error_request"){
          console.log("error_request")
        }else{
          that.setData({
            title: tempOnePost.title,
            author: tempOnePost.author,
            link: tempOnePost.link,
            description: tempOnePost.summary_detail.value,
            published: tempOnePost.published ? util.formatDate("yyyy-MM-dd HH:mm:ss", tempOnePost.published) : '',
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
    // const favicon = `${rssData.link}/favicon.ico`;
    // const rssDataItem = rssData.item[id];
    // const { title, link, pubDate } = rssDataItem;
    // console.log(rssDataItem);
    // this.setData({
    //   title,
    //   author,
    //   link,
    //   description,
    //   pubDate: pubDate ? util.formatDate("yyyy-MM-dd HH:mm:ss", pubDate) : '', // 日期时间需格式化
    // });

    // 多种rss返回值数据的简单兼容处理，待优化（TODO）
    // if (tempOnePost['content:encoded']) {
    //   // 调用富文本转化方法
    //   WxParse.wxParse('article', 'html', tempOnePost['content:encoded'], that, 5);
    //   return;
    // }
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
