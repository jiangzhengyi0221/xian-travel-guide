// pages/detail/detail.js
const places = require('../../data/places.js')
const regions = require('../../data/regions.js')
const { openMapLocation } = require('../../utils/location-utils.js')

Page({
  data: {
    place: {},
    region: {},
    hasLocation: false,
    hasReservationAction: false
  },

  onLoad(options) {
    const place = places.find(item => item.id === options.id)
    const region = place
      ? regions.find(item => item.id === place.regionId)
      : null

    this.setData({
      place: place || {},
      region: region || {},
      hasLocation: Boolean(place) &&
        Number.isFinite(place.latitude) &&
        Number.isFinite(place.longitude),
      hasReservationAction: Boolean(
        place &&
        place.reservation &&
        (
          (place.reservation.type === 'officialAccount' && place.reservation.accountName) ||
          (place.reservation.type === 'web' && place.reservation.url) ||
          (
            place.reservation.type === 'miniProgram' &&
            place.reservation.appId &&
            place.reservation.path
          )
        )
      )
    })
  },

  openReservation() {
    const reservation = this.data.place.reservation

    if (!reservation) {
      this.showReservationError('暂无预约信息。')
      return
    }

    if (reservation.type === 'officialAccount') {
      this.openOfficialAccountReservation(reservation)
      return
    }

    if (reservation.type === 'web') {
      this.openWebReservation(reservation)
      return
    }

    if (reservation.type === 'miniProgram') {
      this.openMiniProgramReservation(reservation)
      return
    }

    this.showReservationError(
      reservation.status === 'notRequired'
        ? '该地点无需预约。'
        : '暂未找到可靠官方入口。'
    )
  },

  openOfficialAccountReservation(reservation) {
    if (!reservation.accountName) {
      this.showReservationError('暂未确认官方公众号名称。')
      return
    }

    wx.showModal({
      title: reservation.platform || '官方微信公众号',
      content: `${reservation.instructions}\n\n公众号：${reservation.accountName}`,
      confirmText: '复制名称',
      cancelText: '取消',
      success: result => {
        if (result.confirm) {
          this.copyReservationText(reservation.accountName, '公众号名称已复制')
        }
      },
      fail: () => {
        this.showReservationError('无法显示预约说明，请稍后重试。')
      }
    })
  },

  openWebReservation(reservation) {
    if (!reservation.url) {
      this.showReservationError('暂未确认官方预约网址。')
      return
    }

    wx.showModal({
      title: reservation.platform || '官方预约网页',
      content: `${reservation.instructions}\n\n官方网址：${reservation.url}`,
      confirmText: '复制网址',
      cancelText: '取消',
      success: result => {
        if (result.confirm) {
          this.copyReservationText(reservation.url, '官方网址已复制')
        }
      },
      fail: () => {
        this.showReservationError('无法显示预约说明，请稍后重试。')
      }
    })
  },

  openMiniProgramReservation(reservation) {
    if (!reservation.appId || !reservation.path) {
      this.showReservationError('暂未确认官方小程序入口参数。')
      return
    }

    wx.navigateToMiniProgram({
      appId: reservation.appId,
      path: reservation.path,
      fail: () => {
        this.showReservationError('无法打开官方预约小程序，请稍后重试。')
      }
    })
  },

  copyReservationText(text, successMessage) {
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: successMessage,
          icon: 'success'
        })
      },
      fail: () => {
        this.showReservationError('复制失败，请稍后重试。')
      }
    })
  },

  showReservationError(message) {
    wx.showToast({
      title: message,
      icon: 'none'
    })
  },

  openNavigation() {
    if (!this.data.hasLocation) {
      return
    }

    openMapLocation(this.data.place)
  }
})
