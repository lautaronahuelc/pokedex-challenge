/**
 * Combines Pokémon sources based on type, generation, and search criteria.
 * @param sources - The sources to combine.
 * @param {Array} sources.typeList - List of Pokémon filtered by type.
 * @param {Array} sources.generationList - List of Pokémon filtered by generation.
 * @param {string} sources.search - Search term to filter Pokémon by name. 
 * @returns {Array|null} The combined list of Pokémon or null if no filters are active.
 */
export function combinePokemonSources({ typeList, generationList, search }) {
  let combined = null

  if (typeList && generationList) {
    const generationNames = new Set(generationList.map((p) => p.name))
    combined = typeList.filter((p) => generationNames.has(p.name))
  } else if (typeList) {
    combined = typeList
  } else if (generationList) {
    combined = generationList
  }

  // combined === null means "there is no type or generation filter active",
  // in that case, the caller should use the general paginated list instead of this result.
  if (combined === null) return null

  if (search) {
    const term = search.toLowerCase()
    combined = combined.filter((p) => p.name.includes(term))
  }

  return combined
}

/**
 * Pages a client-side array of filtered items.
 * @param {Array} items - The items to page.
 * @param {number} page - The current page number.
 * @param {number} pageSize - The number of items per page.
 * @returns {Array} The paged items.
 */
export function paginateClientSide(items, page, pageSize) {
  return items.slice(0, (page + 1) * pageSize)
}