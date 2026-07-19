// pages/home/home.js
const regions = require('../../data/regions.js')

Page({
  data: {
    regions
  },

  goToRegion(event) {
    const { id } = event.currentTarget.dataset

    wx.navigateTo({
      url: `/pages/region/region?id=${id}`
    })
  }
})
