const places = require('../../data/places.js')
const mapPoints = require('../../data/map-points.js')
const {
  defaultCenter,
  defaultScale,
  locatedScale,
  featuredMarkerConfig
} = require('../../data/map-config.js')

const SPECIAL_MARKER_ID_START = 1000

const markerIdToPlaceId = {}

const markers = featuredMarkerConfig
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
  .map(({ place, label }, index) => {
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

markers.push(...specialMarkers)

Page({
  data: {
    markers,
    mapLatitude: defaultCenter.latitude,
    mapLongitude: defaultCenter.longitude,
    mapScale: defaultScale,
    showUserLocation: false,
    isLocating: false
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

  goBack() {
    wx.navigateBack()
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
