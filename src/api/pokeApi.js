import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const pokeApi = createApi({
  reducerPath: 'pokeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  tagTypes: [
    'PokemonList',
    'PokemonDetail',
    'Type',
    'Generation',
    'TypeCatalog',
    'GenerationCatalog',
    'PokemonNameCatalog'
  ],
  endpoints: () => ({}),
})