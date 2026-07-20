// pages/food/food.js
const foods = require('../../data/foods.js')
const regions = require('../../data/regions.js')

Page({
  data: {
    region: {},
    foodRegions: [],
    foods: [],
    hasSelectedRegion: false,
    regionNotFound: false
  },

  onLoad(options) {
    const foodRegions = regions
      .filter(region => foods.some(food => food.regionId === region.id))
      .map(region => ({
        ...region,
        foodCount: foods.filter(food => food.regionId === region.id).length
      }))

    this.setData({
      foodRegions
    })

    if (options.regionId) {
      this.showRegionFoods(options.regionId)
    }
  },

  selectRegion(event) {
    const { id } = event.currentTarget.dataset

    this.showRegionFoods(id)
  },

  showRegionFoods(regionId) {
    const region = regions.find(item => item.id === regionId)

    if (!region) {
      this.setData({
        region: {},
        foods: [],
        hasSelectedRegion: false,
        regionNotFound: true
      })
      return
    }

    const regionFoods = foods.filter(item => item.regionId === region.id)

    this.setData({
      region,
      foods: regionFoods,
      hasSelectedRegion: true,
      regionNotFound: false
    })

    wx.setNavigationBarTitle({
      title: `${region.name}美食`
    })
  }
})
