// pages/home/home.js
const regions = require('../../data/regions.js')
const places = require('../../data/places.js')

const featuredMarkerConfig = [
  {
    placeId: 'xian-bell-tower',
    label: '钟楼'
  },
  {
    placeId: 'dayanta',
    label: '大雁塔'
  },
  {
    placeId: 'terracotta-warriors',
    label: '兵马俑'
  }
]

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

const markers = featuredMarkerPlaces.map(({ place, label }, index) => {
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
    const placeId = markerIdToPlaceId[markerId]

    if (!placeId) {
      return
    }

    wx.navigateTo({
      url: `/pages/detail/detail?id=${placeId}`
    })
  }
})
