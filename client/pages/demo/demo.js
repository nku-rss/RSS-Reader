// client/pages/demo/demo.js
Page({
  data: {
    title: '',
    summary:'',
    summary_detail:'',
    published:'',
    published_parsed:'',
    links:'',
    link:'',
    id:'',
    guidislink:''
      },


  onLoad: function (options) {
    let that =this;
    wx.request({
      url: 'http://127.0.0.1:8000/rssread',
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          title:res.data.title,
          summary: res.data.summary,
          summary_detail: res.data.summary_detail,
          published: res.data.published,
          published_parsed: res.data.published_parsed,
          links: res.data.links,
          link: res.data.link,
          id: res.data.id,
          guidislink: res.data.guidislink
        })
        console.log("read success");

      },
      fail: function (res) {
        console.log('submit fail');
      },
      complete: function (res) {
        console.log('submit complete');
      }
    })

  },

})