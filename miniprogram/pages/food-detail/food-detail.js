const foods = require('../../data/foods.js')
const regions = require('../../data/regions.js')

Page({
  data: {
    food: {},
    region: {},
    foodNotFound: false
  },

  onLoad(options) {
    const food = foods.find(item => item.id === options.id)

    if (!food) {
      this.setData({
        food: {},
        region: {},
        foodNotFound: true
      })
      return
    }

    const region = regions.find(item => item.id === food.regionId)

    this.setData({
      food,
      region: region || {},
      foodNotFound: false
    })
  }
})
