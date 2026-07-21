// pages/detail/detail.js
const places = require('../../data/places.js')
const regions = require('../../data/regions.js')
const { openMapLocation } = require('../../utils/location-utils.js')

Page({
  data: {
    place: {},
    region: {},
    hasLocation: false
  },

  onLoad(options) {
    const place = places.find(item => item.id === options.id)
    const region = place
      ? regions.find(item => item.id === place.regionId)
      : null

    this.setData({
      place: place || {},
      region: region || {},
      hasLocation: Boolean(place) &&
        Number.isFinite(place.latitude) &&
        Number.isFinite(place.longitude)
    })
  },

  openNavigation() {
    if (!this.data.hasLocation) {
      return
    }

    openMapLocation(this.data.place)
  }
})
