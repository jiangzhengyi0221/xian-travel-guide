// pages/region/region.js
const regions = require('../../data/regions.js')
const places = require('../../data/places.js')
const foods = require('../../data/foods.js')

Page({
  data: {
    region: {},
    attractions: [],
    foods: []
  },

  onLoad(options) {
    const region = regions.find(item => item.id === options.id)
    const regionPlaces = region
      ? places.filter(item => item.regionId === region.id)
      : []
    const attractions = regionPlaces.filter(item => item.type === 'attraction')
    const regionFoods = region
      ? foods.filter(item => item.regionId === region.id)
      : []

    this.setData({
      region: region || {},
      attractions,
      foods: regionFoods
    })
  }
})
