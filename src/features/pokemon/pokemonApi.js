import { pokeApi } from '../../api/pokeApi'

const PAGE_SIZE = 7

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
      keepUnusedDataFor: 0, // workaround to avoid infinite scrolling error
    }),

		getPokemonDetail: builder.query({
			query: (name) => `pokemon/${name}`,
			providesTags: (result, error, name) => [{ type: 'PokemonDetail', id: name }],
		}),

    getPokemonByType: builder.query({
      query: (typeName) => `type/${typeName}`,
      transformResponse: (response) => response.pokemon.map((entry) => entry.pokemon),
      providesTags: (result, error, typeName) => [{ type: 'Type', id: typeName }],
    }),

    getPokemonByGeneration: builder.query({
      query: (generationId) => `generation/${generationId}`,
      transformResponse: (response) => response.pokemon_species,
      providesTags: (result, error, generationId) => [{ type: 'Generation', id: generationId }],
    }),

    getTypeList: builder.query({
      query: () => 'type',
      transformResponse: (response) => response.results,
      providesTags: ['TypeCatalog'],
      keepUnusedDataFor: 3600,
    }),

    getGenerationList: builder.query({
      query: () => 'generation',
      transformResponse: (response) => response.results,
      providesTags: ['GenerationCatalog'],
      keepUnusedDataFor: 3600,
    }),

    getAllPokemonNames: builder.query({
      query: () => 'pokemon?limit=100000&offset=0',
      transformResponse: (response) => response.results,
      providesTags: ['PokemonNameCatalog'],
      keepUnusedDataFor: 3600,
    }),
  }),
})

export const {
  useGetPokemonListQuery,
  useGetPokemonDetailQuery,
  useGetPokemonByTypeQuery,
  useGetPokemonByGenerationQuery,
  useGetTypeListQuery,
  useGetGenerationListQuery,
  useGetAllPokemonNamesQuery,
} = pokemonApi