function buildSearchSuggestions({
  places = [],
  foods = [],
  keyword = '',
  limit = 5
} = {}) {
  const normalizedKeyword = typeof keyword === 'string'
    ? keyword.trim().toLowerCase()
    : ''

  if (!normalizedKeyword) {
    return []
  }

  const prefixMatches = []
  const containsMatches = []
  const maxResults = Number.isInteger(limit) && limit > 0 ? limit : 5

  const collectMatches = (items, resultType) => {
    items.forEach(item => {
      if (!item || typeof item.name !== 'string') {
        return
      }

      const normalizedName = item.name.toLowerCase()
      const suggestion = {
        id: item.id,
        kind: resultType,
        icon: resultType === 'place' ? '🏯' : '🍜',
        typeLabel: resultType === 'place' ? '景点' : '美食',
        name: item.name,
        url: resultType === 'place'
          ? `/pages/detail/detail?id=${item.id}`
          : `/pages/food-detail/food-detail?id=${item.id}`
      }

      if (normalizedName.startsWith(normalizedKeyword)) {
        prefixMatches.push(suggestion)
      } else if (normalizedName.includes(normalizedKeyword)) {
        containsMatches.push(suggestion)
      }
    })
  }

  collectMatches(places, 'place')
  collectMatches(foods, 'food')

  return prefixMatches
    .concat(containsMatches)
    .slice(0, maxResults)
}

module.exports = {
  buildSearchSuggestions
}
