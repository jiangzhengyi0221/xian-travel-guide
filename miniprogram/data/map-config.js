const mapConfig = {
  defaultCenter: {
    latitude: 34.341568,
    longitude: 108.940174
  },
  defaultScale: 12,
  locatedScale: 14,
  nearbyRadiusKm: 3,
  nearbyLimit: 5,
  featuredMarkerConfig: [
    {
      placeId: 'xian-bell-tower',
      label: '钟楼'
    },
    {
      placeId: 'dayanta',
      label: '大雁塔'
    },
    {
      placeId: 'shaanxi-history-museum',
      label: '陕西历史博物馆'
    },
    {
      placeId: 'sajinqiao',
      label: '洒金桥'
    },
    {
      placeId: 'datang-everbright-city',
      label: '大唐不夜城'
    }
  ]
}

module.exports = mapConfig
