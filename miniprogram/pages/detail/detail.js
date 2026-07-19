// pages/detail/detail.js
const places = require('../../data/places.js')

Page({
  data: {
    place: {}
  },

  onLoad(options) {
    const place = places.find(item => item.id === options.id)

    this.setData({
      place: place || {}
    })
  }
})
