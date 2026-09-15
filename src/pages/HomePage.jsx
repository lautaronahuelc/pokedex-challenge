import { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { nextPage } from '../features/pokemon/pageSlice'
import {
  useGetPokemonListQuery,
  useGetPokemonByTypeQuery,
  useGetPokemonByGenerationQuery,
  useGetAllPokemonNamesQuery,
} from '../features/pokemon/pokemonApi'
import { combinePokemonSources, paginateClientSide } from '../features/pokemon/filterPokemon'
import PokemonCard from '../features/pokemon/PokemonCard'
import SearchBar from '../features/pokemon/SearchBar'
import FilterBar from '../features/pokemon/FilterBar'

const CLIENT_PAGE_SIZE = 7

function HomePage() {
  const apiPage = useSelector((state) => state.apiPage.number)
  const dispatch = useDispatch()

  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const type = searchParams.get('type') ?? ''
  const generation = searchParams.get('generation') ?? ''

  const hasActiveFilters = Boolean(type || generation || search)

  // Normal pagination: infinite scroll with the API, when no filters are active.
  const apiListQuery = useGetPokemonListQuery(apiPage, { skip: hasActiveFilters })

  // Client-side pagination: when filters are active, we fetch all the filtered results and paginate them in the client.
  const [clientPage, setClientPage] = useState(0)
  const typeQuery = useGetPokemonByTypeQuery(type, { skip: !type })
  const generationQuery = useGetPokemonByGenerationQuery(generation, { skip: !generation })
  const searchQuery = useGetAllPokemonNamesQuery()

  const typeReady = !type || typeQuery.data !== undefined || typeQuery.isError
  const generationReady = !generation || generationQuery.data !== undefined || generationQuery.isError
  const searchReady = !search || searchQuery.data !== undefined || searchQuery.isError
  const filtersReady = typeReady && generationReady && searchReady

  const isFilteredLoading = hasActiveFilters && !filtersReady
  const isFilteredError = typeQuery.isError || generationQuery.isError || searchQuery.isError

  const filteredResults = hasActiveFilters && filtersReady
    ? combinePokemonSources({
        typeList: type ? typeQuery.data : null,
        generationList: generation ? generationQuery.data : null,
        search,
        allPokemonList: search ? searchQuery.data : null,
      })
    : null

  useEffect(() => {
    setClientPage(0)
  }, [type, generation, search])

  const visibleFilteredResults = filteredResults
    ? paginateClientSide(filteredResults, clientPage, CLIENT_PAGE_SIZE)
    : null

  const hasMoreFilteredResults = filteredResults
    ? visibleFilteredResults.length < filteredResults.length
    : false

  const isFetching = hasActiveFilters ? isFilteredLoading : apiListQuery.isFetching
  const canLoadMore = hasActiveFilters ? hasMoreFilteredResults : true
    
  const observerRef = useRef(null)
  const stateRef = useRef({ isFetching, canLoadMore, hasActiveFilters })
  useEffect(() => {
    stateRef.current = { isFetching, canLoadMore, hasActiveFilters }
  }, [isFetching, canLoadMore, hasActiveFilters])

  const sentinelRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect()
    if (!node) return

    observerRef.current = new IntersectionObserver(([entry]) => {
      const {
        isFetching: currentFetching,
        canLoadMore: currentCanLoadMore,
        hasActiveFilters: currentHasFilters
      } = stateRef.current

      if (entry.isIntersecting && !currentFetching && currentCanLoadMore) {
        if (currentHasFilters) {
          setClientPage((p) => p + 1)
        } else {
          dispatch(nextPage())
        }
      }
    })

    observerRef.current.observe(node)
  },[])

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [])

  const itemsToRender = hasActiveFilters ? visibleFilteredResults : apiListQuery.data?.results

  const isInitialLoading = hasActiveFilters
    ? isFilteredLoading && !filteredResults
    : apiListQuery.isLoading

  if (isInitialLoading) return <p>Cargando...</p>

  if (hasActiveFilters && isFilteredError) {
    return (
      <div>
        <p>No pudimos cargar el filtro seleccionado.</p>
        <button
          onClick={() => {
            if (typeQuery.isError) typeQuery.refetch()
            if (generationQuery.isError) generationQuery.refetch()
          }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div>      
      <SearchBar />
      <FilterBar />

      {hasActiveFilters && filteredResults && filteredResults.length === 0 && (
        <p>No encontramos pokémon con esos filtros.</p>
      )}

      <ul>
        {itemsToRender?.map((pokemon) => (
          <PokemonCard key={pokemon.name} name={pokemon.name} />
        ))}
      </ul>

      {isFetching && <p>Cargando más...</p>}

      <div ref={sentinelRef} style={{ height: '1px' }} />
    </div>
  )
}

export default HomePage