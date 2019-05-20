Page({
  data: {
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
  }
});