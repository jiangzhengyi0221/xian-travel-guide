// pages/region/region.js
const regions = require('../../data/regions.js')
const places = require('../../data/places.js')
const foods = require('../../data/foods.js')
const { buildSearchSuggestions } = require('../../utils/search-utils.js')

Page({
  data: {
    region: {},
    attractions: [],
    foods: [],
    activeSection: '',
    isSearchActive: false,
    searchInputFocused: false,
    searchKeyword: '',
    searchSuggestions: [],
    hasSearchKeyword: false
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
  },

  activateSearch() {
    this.setData({
      isSearchActive: true
    }, () => {
      this.setData({
        searchInputFocused: true
      })
    })
  },

  onSearchInput(event) {
    this.updateSearchSuggestions(event.detail.value)
  },

  onSearchConfirm(event) {
    this.updateSearchSuggestions(event.detail.value)
  },

  updateSearchSuggestions(value) {
    const keyword = typeof value === 'string' ? value : ''
    const hasSearchKeyword = Boolean(keyword.trim())
    const searchSuggestions = hasSearchKeyword
      ? buildSearchSuggestions({
        places: this.data.attractions,
        foods: this.data.foods,
        keyword,
        limit: 5
      })
      : []

    this.setData({
      searchKeyword: keyword,
      searchSuggestions,
      hasSearchKeyword
    })
  },

  cancelSearch() {
    this.setData({
      isSearchActive: false,
      searchInputFocused: false,
      searchKeyword: '',
      searchSuggestions: [],
      hasSearchKeyword: false
    })
  },

  goToSearchResult(event) {
    const { url } = event.currentTarget.dataset

    if (!url) {
      return
    }

    this.setData({
      isSearchActive: false,
      searchInputFocused: false,
      searchKeyword: '',
      searchSuggestions: [],
      hasSearchKeyword: false
    }, () => {
      wx.navigateTo({ url })
    })
  },

  toggleSection(event) {
    const section = event.currentTarget.dataset.section

    if (section !== 'attractions' && section !== 'foods') {
      return
    }

    this.setData({
      activeSection: this.data.activeSection === section ? '' : section
    })
  }
})
