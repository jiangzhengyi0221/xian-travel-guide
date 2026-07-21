const foods = require('../../data/foods.js')

Page({
  data: {
    food: {},
    markers: [],
    mapLatitude: 0,
    mapLongitude: 0,
    mapScale: 16,
    locationNotFound: false
  },

  onLoad(options) {
    const food = foods.find(item => item.id === options.id)
    const hasValidLocation = food &&
      Number.isFinite(food.latitude) &&
      Number.isFinite(food.longitude)

    if (!hasValidLocation) {
      this.setData({
        food: food || {},
        markers: [],
        locationNotFound: true
      })
      return
    }

    this.setData({
      food,
      mapLatitude: food.latitude,
      mapLongitude: food.longitude,
      markers: [
        {
          id: 1,
          latitude: food.latitude,
          longitude: food.longitude,
          title: food.name,
          width: 32,
          height: 32,
          callout: {
            content: food.name,
            display: 'ALWAYS'
          }
        }
      ],
      locationNotFound: false
    })

    wx.setNavigationBarTitle({
      title: `${food.name}参考位置`
    })
  }
})
