/**
 * Combines Pokémon sources based on type, generation, and search criteria.
 * @param sources - The sources to combine.
 * @param {Array} sources.typeList - List of Pokémon filtered by type.
 * @param {Array} sources.generationList - List of Pokémon filtered by generation.
 * @param {string} sources.search - Search term to filter Pokémon by name.
 * @param {Array} sources.allPokemonList - List of all Pokémons.
 * @returns {Array|null} The combined list of Pokémon or null if no filters are active.
 */
export function combinePokemonSources({ typeList, generationList, search, allPokemonList }) {
  // Base list with type & generation combined
  let baseList;

  if (typeList && generationList) {
    const generationNames = new Set(generationList.map((p) => p.name));
    baseList = typeList.filter((p) => generationNames.has(p.name));
  } else {
    baseList = typeList || generationList;
  }

  if (!baseList && !search) {
    return null; // The app will use normal pagination
  }

  const sourceList = baseList || allPokemonList;

  if (!search) {
    return sourceList;
  }

  const searchLower = search.toLowerCase();
  return sourceList.filter((p) => p.name.toLowerCase().includes(searchLower));
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