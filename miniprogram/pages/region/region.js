// pages/region/region.js
const regions = require('../../data/regions.js')
const places = require('../../data/places.js')

Page({
  data: {
    region: {},
    attractions: [],
    foods: [],
    hotels: []
  },

  onLoad(options) {
    const region = regions.find(item => item.id === options.id)
    const regionPlaces = region
      ? places.filter(item => item.regionId === region.id)
      : []
    const attractions = regionPlaces.filter(item => item.type === 'attraction')
    const foods = regionPlaces.filter(item => item.type === 'food')
    const hotels = regionPlaces.filter(item => item.type === 'hotel')

    this.setData({
      region: region || {},
      attractions,
      foods,
      hotels
    })
  }
})
