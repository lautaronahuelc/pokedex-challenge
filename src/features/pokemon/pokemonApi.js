import { pokeApi } from '../../api/pokeApi'

export const pokemonApi = pokeApi.injectEndpoints({
  endpoints: (builder) => ({
    getPokemonList: builder.query({
      query: () => 'pokemon?limit=20&offset=0',
    }),
  }),
})

export const { useGetPokemonListQuery } = pokemonApi