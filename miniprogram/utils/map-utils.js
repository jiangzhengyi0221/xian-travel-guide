const EARTH_RADIUS_KM = 6371.0088

function hasValidLocation(item) {
  return Boolean(
    item &&
    Number.isFinite(item.latitude) &&
    Number.isFinite(item.longitude) &&
    item.latitude >= -90 &&
    item.latitude <= 90 &&
    item.longitude >= -180 &&
    item.longitude <= 180
  )
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180
}

function calculateDistance(origin, target) {
  if (!hasValidLocation(origin) || !hasValidLocation(target)) {
    return Infinity
  }

  const originLatitude = degreesToRadians(origin.latitude)
  const targetLatitude = degreesToRadians(target.latitude)
  const latitudeDifference = targetLatitude - originLatitude
  const longitudeDifference = degreesToRadians(
    target.longitude - origin.longitude
  )

  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(targetLatitude) *
      Math.sin(longitudeDifference / 2) ** 2
  const normalizedHaversine = Math.min(1, Math.max(0, haversine))

  return 2 * EARTH_RADIUS_KM * Math.atan2(
    Math.sqrt(normalizedHaversine),
    Math.sqrt(1 - normalizedHaversine)
  )
}

function findNearbyPlaces(currentPlace, allPlaces, options = {}) {
  if (!hasValidLocation(currentPlace) || !Array.isArray(allPlaces)) {
    return []
  }

  const { radiusKm = Infinity, limit = allPlaces.length } = options

  return allPlaces
    .filter(place => place.id !== currentPlace.id && hasValidLocation(place))
    .map(place => ({
      place,
      distanceKm: calculateDistance(currentPlace, place)
    }))
    .filter(item => item.distanceKm <= radiusKm)
    .sort((first, second) => first.distanceKm - second.distanceKm)
    .slice(0, limit)
}

module.exports = {
  hasValidLocation,
  calculateDistance,
  findNearbyPlaces
}
