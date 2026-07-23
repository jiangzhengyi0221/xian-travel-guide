// pages/search/search.js
const regions = require('../../data/regions.js')
const places = require('../../data/places.js')
const foods = require('../../data/foods.js')
const { buildSearchSuggestions } = require('../../utils/search-utils.js')

Page({
  data: {
    keyword: '',
    region: {},
    isRegionSearch: false,
    suggestions: [],
    hasKeyword: false
  },

  onLoad(options) {
    const regionId = options.regionId || ''
    const region = regions.find(item => item.id === regionId)

    this.placeSource = region
      ? places.filter(item => item.regionId === region.id)
      : places
    this.foodSource = region
      ? foods.filter(item => item.regionId === region.id)
      : foods

    this.setData({
      region: region || {},
      isRegionSearch: Boolean(region)
    })

    wx.setNavigationBarTitle({
      title: region ? `搜索${region.name}` : '搜索西安'
    })
  },

  onKeywordInput(event) {
    this.updateSuggestions(event.detail.value)
  },

  onKeywordConfirm(event) {
    this.updateSuggestions(event.detail.value)
  },

  updateSuggestions(value) {
    const keyword = typeof value === 'string' ? value : ''
    const hasKeyword = Boolean(keyword.trim())

    if (!hasKeyword) {
      this.setData({
        keyword,
        suggestions: [],
        hasKeyword: false
      })
      return
    }

    const suggestions = buildSearchSuggestions({
      places: this.placeSource,
      foods: this.foodSource,
      keyword,
      limit: 5
    })

    this.setData({
      keyword,
      suggestions,
      hasKeyword: true
    })
  }
})
