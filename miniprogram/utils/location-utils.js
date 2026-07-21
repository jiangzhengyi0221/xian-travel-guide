function hasValidLocation(location) {
  return Boolean(
    location &&
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude) &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180
  )
}

function openMapLocation(location) {
  if (!hasValidLocation(location)) {
    return false
  }

  wx.openLocation({
    latitude: location.latitude,
    longitude: location.longitude,
    scale: 18,
    name: location.name || '',
    address: location.address || '',
    fail: () => {
      wx.showToast({
        title: '无法打开地图，请稍后重试。',
        icon: 'none'
      })
    }
  })

  return true
}

module.exports = {
  openMapLocation
}
