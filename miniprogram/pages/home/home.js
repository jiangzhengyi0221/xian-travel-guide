// pages/home/home.js
const regions = require('../../data/regions.js')
const places = require('../../data/places.js')

const markerPlaces = places.filter(place => (
  Number.isFinite(place.latitude) &&
  Number.isFinite(place.longitude)
))

const markerPlaceIds = markerPlaces.map(place => place.id)

const markers = markerPlaces.map((place, index) => ({
    id: index + 1,
    latitude: place.latitude,
    longitude: place.longitude,
    title: place.name,
    width: 32,
    height: 32,
    callout: {
      content: place.name,
      display: 'ALWAYS'
    }
  }))

Page({
  data: {
    regions,
    markers,
    mapLatitude: 34.341568,
    mapLongitude: 108.940174,
    mapScale: 12
  },

  goToRegion(event) {
    const { id } = event.currentTarget.dataset

    wx.navigateTo({
      url: `/pages/region/region?id=${id}`
    })
  },

  goToPlaceDetail(event) {
    const markerId = Number(event.detail.markerId)
    const placeId = markerPlaceIds[markerId - 1]

    if (!placeId) {
      return
    }

    wx.navigateTo({
      url: `/pages/detail/detail?id=${placeId}`
    })
  }
})
