import { pokeApi } from '../../api/pokeApi'

const PAGE_SIZE = 20

export const pokemonApi = pokeApi.injectEndpoints({
  endpoints: (builder) => ({
    getPokemonList: builder.query({
    	query: (page = 0) => `pokemon?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`,
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        currentCache.results.push(...newItems.results)
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
			providesTags: ['PokemonList'],
    }),

		getPokemonDetail: builder.query({
			query: (name) => `pokemon/${name}`,
			providesTags: (result, error, name) => [{ type: 'PokemonDetail', id: name }],
		}),
  }),
})

export const { useGetPokemonListQuery, useGetPokemonDetailQuery } = pokemonApi