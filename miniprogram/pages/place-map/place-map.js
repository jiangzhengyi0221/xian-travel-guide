const places = require('../../data/places.js')
const regions = require('../../data/regions.js')
const {
  nearbyRadiusKm,
  nearbyLimit
} = require('../../data/map-config.js')
const {
  hasValidLocation,
  findNearbyPlaces
} = require('../../utils/map-utils.js')

Page({
  data: {
    place: {},
    region: {},
    markers: [],
    mapLatitude: 0,
    mapLongitude: 0,
    mapScale: 16,
    includePoints: [],
    locationNotFound: false
  },

  onLoad(options) {
    const place = places.find(item => item.id === options.id)

    if (!hasValidLocation(place)) {
      this.markerIdToPlaceId = {}

      this.setData({
        place: place || {},
        region: {},
        markers: [],
        includePoints: [],
        locationNotFound: true
      })
      return
    }

    const region = regions.find(item => item.id === place.regionId)
    const nearbyPlaces = findNearbyPlaces(place, places, {
      radiusKm: nearbyRadiusKm,
      limit: nearbyLimit
    })
    const currentMarker = {
      id: 1,
      latitude: place.latitude,
      longitude: place.longitude,
      title: place.name,
      width: 32,
      height: 32,
      callout: {
        content: place.name,
        display: 'ALWAYS'
      }
    }

    this.markerIdToPlaceId = {
      1: place.id
    }

    const nearbyMarkers = nearbyPlaces.map(({ place: nearbyPlace }, index) => {
      const markerId = index + 2

      this.markerIdToPlaceId[markerId] = nearbyPlace.id

      return {
        id: markerId,
        latitude: nearbyPlace.latitude,
        longitude: nearbyPlace.longitude,
        title: nearbyPlace.name,
        width: 28,
        height: 28,
        callout: {
          content: nearbyPlace.name,
          display: 'ALWAYS'
        }
      }
    })
    const markers = [currentMarker, ...nearbyMarkers]
    const includePoints = nearbyMarkers.length
      ? markers.map(marker => ({
          latitude: marker.latitude,
          longitude: marker.longitude
        }))
      : []

    this.setData({
      place,
      region: region || {},
      mapLatitude: place.latitude,
      mapLongitude: place.longitude,
      markers,
      includePoints,
      locationNotFound: false
    })

    wx.setNavigationBarTitle({
      title: `${place.name}参考位置`
    })
  },

  goToNearbyPlaceDetail(event) {
    const markerId = Number(event.detail.markerId)
    const placeId = this.markerIdToPlaceId &&
      this.markerIdToPlaceId[markerId]

    if (!placeId || placeId === this.data.place.id) {
      return
    }

    wx.navigateTo({
      url: `/pages/detail/detail?id=${placeId}`
    })
  }
})
