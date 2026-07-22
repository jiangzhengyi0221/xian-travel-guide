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
    const images = Array.isArray(food.images)
      ? food.images.filter(item => typeof item === 'string' && item.trim())
      : []

    this.setData({
      food: {
        ...food,
        images
      },
      region: region || {},
      foodNotFound: false,
      hasLocation: Number.isFinite(food.latitude) && Number.isFinite(food.longitude)
    })
  },

  previewImage(event) {
    const images = this.data.food && Array.isArray(this.data.food.images)
      ? this.data.food.images
      : []
    const current = event.currentTarget.dataset.src

    if (!images.length || !current || !images.includes(current)) {
      return
    }

    wx.previewImage({
      current,
      urls: images
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
