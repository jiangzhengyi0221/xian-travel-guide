const places = require('../../data/places.js')
const regions = require('../../data/regions.js')

Page({
  data: {
    place: {},
    region: {},
    markers: [],
    mapLatitude: 0,
    mapLongitude: 0,
    mapScale: 16,
    locationNotFound: false
  },

  onLoad(options) {
    const place = places.find(item => item.id === options.id)
    const hasValidLocation = place &&
      Number.isFinite(place.latitude) &&
      Number.isFinite(place.longitude)

    if (!hasValidLocation) {
      this.setData({
        place: place || {},
        region: {},
        markers: [],
        locationNotFound: true
      })
      return
    }

    const region = regions.find(item => item.id === place.regionId)

    this.setData({
      place,
      region: region || {},
      mapLatitude: place.latitude,
      mapLongitude: place.longitude,
      markers: [
        {
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
      ],
      locationNotFound: false
    })

    wx.setNavigationBarTitle({
      title: `${place.name}参考位置`
    })
  }
})
