// pages/home/home.js
const regions = require('../../data/regions.js')
const places = require('../../data/places.js')
const mapPoints = require('../../data/map-points.js')
const { buildSearchSuggestions } = require('../../utils/search-utils.js')
const {
  defaultCenter,
  defaultScale,
  locatedScale,
  featuredMarkerConfig
} = require('../../data/map-config.js')

const SPECIAL_MARKER_ID_START = 1000
const SEARCH_RESULT_MARKER_ID = 2000
const SEARCH_RESULT_SCALE = 15

const featuredMarkerPlaces = featuredMarkerConfig
  .map(config => {
    const place = places.find(item => item.id === config.placeId)

    if (
      !place ||
      !Number.isFinite(place.latitude) ||
      !Number.isFinite(place.longitude)
    ) {
      return null
    }

    return {
      place,
      label: config.label
    }
  })
  .filter(item => item)

const markerIdToPlaceId = {}

const featuredMarkers = featuredMarkerPlaces.map(({ place, label }, index) => {
  const markerId = index + 1

  markerIdToPlaceId[markerId] = place.id

  return {
    id: markerId,
    latitude: place.latitude,
    longitude: place.longitude,
    title: label,
    width: 32,
    height: 32,
    callout: {
      content: label,
      display: 'ALWAYS'
    }
  }
})

const specialMarkers = mapPoints
  .filter(point => (
    Number.isFinite(point.latitude) &&
    Number.isFinite(point.longitude)
  ))
  .map((point, index) => ({
    id: SPECIAL_MARKER_ID_START + index,
    latitude: point.latitude,
    longitude: point.longitude,
    title: point.name,
    width: 32,
    height: 32,
    callout: {
      content: point.name,
      display: 'ALWAYS'
    }
  }))

const baseMarkers = featuredMarkers.concat(specialMarkers)

Page({
  data: {
    regions,
    markers: baseMarkers,
    mapLatitude: defaultCenter.latitude,
    mapLongitude: defaultCenter.longitude,
    mapScale: defaultScale,
    showUserLocation: false,
    isLocating: false,
    isSearchActive: false,
    searchInputFocused: false,
    searchKeyword: '',
    searchSuggestions: [],
    hasSearchKeyword: false
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
      ? buildSearchSuggestions({ places, keyword, limit: 5 })
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

  onSearchSuggestionTap(event) {
    const { id } = event.currentTarget.dataset
    const place = places.find(item => item.id === id)

    if (
      !place ||
      !Number.isFinite(place.latitude) ||
      !Number.isFinite(place.longitude)
    ) {
      wx.showToast({
        title: '暂时无法定位该景点',
        icon: 'none'
      })
      return
    }

    markerIdToPlaceId[SEARCH_RESULT_MARKER_ID] = place.id

    const visibleBaseMarkers = baseMarkers.filter(marker => (
      markerIdToPlaceId[marker.id] !== place.id
    ))
    const searchResultMarker = {
      id: SEARCH_RESULT_MARKER_ID,
      latitude: place.latitude,
      longitude: place.longitude,
      title: place.name,
      width: 36,
      height: 36,
      zIndex: 10,
      callout: {
        content: place.name,
        color: '#ffffff',
        fontSize: 13,
        borderRadius: 8,
        bgColor: '#a24b32',
        padding: 8,
        display: 'ALWAYS'
      }
    }

    this.setData({
      markers: visibleBaseMarkers.concat(searchResultMarker),
      mapLatitude: place.latitude,
      mapLongitude: place.longitude,
      mapScale: SEARCH_RESULT_SCALE,
      isSearchActive: false,
      searchInputFocused: false,
      searchKeyword: '',
      searchSuggestions: [],
      hasSearchKeyword: false
    })
  },

  locateUser() {
    if (this.data.isLocating) {
      return
    }

    this.setData({
      isLocating: true
    })

    wx.getLocation({
      type: 'gcj02',
      success: ({ latitude, longitude }) => {
        this.setData({
          mapLatitude: latitude,
          mapLongitude: longitude,
          mapScale: locatedScale,
          showUserLocation: true
        })
      },
      fail: () => {
        wx.showToast({
          title: '无法获取当前位置，请检查定位权限或系统定位设置。',
          icon: 'none',
          duration: 3000
        })
      },
      complete: () => {
        this.setData({
          isLocating: false
        })
      }
    })
  },

  goToFullMap() {
    wx.navigateTo({
      url: '/pages/full-map/full-map'
    })
  },

  goToRegion(event) {
    const { id } = event.currentTarget.dataset

    wx.navigateTo({
      url: `/pages/region/region?id=${id}`
    })
  },

  goToPlaceDetail(event) {
    const markerId = Number(event.detail.markerId)
    const placeId = markerIdToPlaceId[markerId]

    if (!placeId) {
      return
    }

    wx.navigateTo({
      url: `/pages/detail/detail?id=${placeId}`
    })
  }
})
