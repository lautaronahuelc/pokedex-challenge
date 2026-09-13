/**
 * [UNUSED. REMOVE IF NOT NEEDED IN THE FUTURE]
 * 
 * Extract the ID from a Pokemon URL.
 * @param {string} url - The URL of the Pokemon.
 * @returns {string|null} The ID of the Pokemon or null if not found.
 * 
 * The URL of each item in the list has the form:
 * https://pokeapi.co/api/v2/pokemon/25/
 */
export function extractIdFromUrl(url) {
  const match = url.match(/\/pokemon\/(\d+)\//)
  console.log('extractIdFromUrl', url, match)
  return match ? match[1] : null
}