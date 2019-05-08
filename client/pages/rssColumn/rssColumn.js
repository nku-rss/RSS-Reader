//index.js
//获取应用实例
const app = getApp()

Page({
  onLoad(event) {

    wx.createSelectorQuery().select('post')

  },

  onClick(event) {
    wx.showToast({
      title: `点击标签 ${event.detail.index + 1}`,
      icon: 'none'
    });
  },
  //touch start
  handleTouchStart: function (e) {
    this.startTime = e.timeStamp;
    //console.log("-------- startTime = " + e.timeStamp);  
  },

  //touch end
  handleTouchEnd: function (e) {
    this.endTime = e.timeStamp;
    //console.log("-------- endTime = " + e.timeStamp);  
  },

  handleClick: function (e) {
    //console.log("----------------- endTime - startTime = " + (this.endTime - this.startTime));    
    if (this.endTime - this.startTime < 350) {
      console.log("clicked");
    }
  },

  handleLongPress: function (e) {
    //console.log("----------------- endTime - startTime = " + (this.endTime - this.startTime));
    console.log("长按");
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '下拉刷新',
      icon: 'none'
    });
    wx.stopPullDownRefresh();
  }
  
});