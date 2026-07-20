// pages/detail/detail.js
const places = require('../../data/places.js')
const regions = require('../../data/regions.js')

Page({
  data: {
    place: {},
    region: {}
  },

  onLoad(options) {
    const place = places.find(item => item.id === options.id)
    const region = place
      ? regions.find(item => item.id === place.regionId)
      : null

    this.setData({
      place: place || {},
      region: region || {}
    })
  }
})
