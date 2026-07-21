const foods = require('../../data/foods.js')
const regions = require('../../data/regions.js')
const { openMapLocation } = require('../../utils/location-utils.js')

Page({
  data: {
    food: {},
    region: {},
    foodNotFound: false,
    hasLocation: false
  },

  onLoad(options) {
    const food = foods.find(item => item.id === options.id)

    if (!food) {
      this.setData({
        food: {},
        region: {},
        foodNotFound: true,
        hasLocation: false
      })
      return
    }

    const region = regions.find(item => item.id === food.regionId)

    this.setData({
      food,
      region: region || {},
      foodNotFound: false,
      hasLocation: Number.isFinite(food.latitude) && Number.isFinite(food.longitude)
    })
  },

  openNavigation() {
    const food = this.data.food

    if (!this.data.hasLocation || !food || !food.id) {
      return
    }

    openMapLocation({
      ...food,
      name: food.shop || food.name
    })
  }
})
