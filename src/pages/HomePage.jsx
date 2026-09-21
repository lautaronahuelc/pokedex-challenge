import { useState, useRef, useEffect } from 'react'
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
import ErrorMessage from '../components/shared/ErrorMessage'
import styles from './HomePage.module.css'

const CLIENT_PAGE_SIZE = 9

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
  const filterKey = `${type}|${generation}|${search}`
  const [clientPagination, setClientPagination] = useState({
    key: filterKey,
    page: 0,
  })
  const clientPage = clientPagination.key === filterKey ? clientPagination.page : 0
  const typeQuery = useGetPokemonByTypeQuery(type, { skip: !type })
  const generationQuery = useGetPokemonByGenerationQuery(generation, { skip: !generation })
  const searchQuery = useGetAllPokemonNamesQuery(undefined, { skip: !search })

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

  const visibleFilteredResults = filteredResults
    ? paginateClientSide(filteredResults, clientPage, CLIENT_PAGE_SIZE)
    : null

  const hasMoreFilteredResults = filteredResults
    ? visibleFilteredResults.length < filteredResults.length
    : false

  const isFetching = hasActiveFilters ? isFilteredLoading : apiListQuery.isFetching
  const canLoadMore = hasActiveFilters ? hasMoreFilteredResults : true
    
  const sentinelRef = useRef(null)

  const itemsToRender = hasActiveFilters
    ? visibleFilteredResults ?? []
    : apiListQuery.data?.results ?? []

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetching && canLoadMore) {
        if (hasActiveFilters) {
          setClientPagination((current) => ({
            key: filterKey,
            page: (current.key === filterKey ? current.page : 0) + 1,
          }))
        } else {
          dispatch(nextPage())
        }
      }
    })

    observer.observe(node)

    return () => observer.disconnect()
  }, [
    dispatch,
    isFetching,
    canLoadMore,
    hasActiveFilters,
    filterKey,
    itemsToRender.length,
  ])

  const handleFilterRetry = () => {
    if (typeQuery.isError) typeQuery.refetch()
    if (generationQuery.isError) generationQuery.refetch()
    if (searchQuery.isError) searchQuery.refetch()
  }

  const handleApiListRetry = () => {
    apiListQuery.refetch()
  }

  const isInitialLoading = hasActiveFilters
    ? isFilteredLoading && !filteredResults
    : apiListQuery.isLoading

  if (isInitialLoading) return <p>Cargando...</p>

  if (hasActiveFilters && isFilteredError) {  
    return (
        <div className={styles.container}>
          <ErrorMessage message={'No pudimos cargar el filtro seleccionado.'} onRetry={handleFilterRetry} />
        </div>
      )
  }

  if (!itemsToRender.length && apiListQuery.isError) {  
    return (
        <div className={styles.container}>
          <ErrorMessage message={'Error al cargar pokemones.'} onRetry={handleApiListRetry} />
        </div>
      )
  }

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        {isFilteredError ? (
          <ErrorMessage message={'Error al cargar los filtros'} onRetry={handleFilterRetry}/>
        ) : (
          <>
            <SearchBar />
            <FilterBar />
          </>
        )}
      </div> 

      {hasActiveFilters && filteredResults && filteredResults.length === 0 && (
        <ErrorMessage message={'No encontramos pokemons con esos filtros.'} />
      )}

      <ul className={styles.grid}>
        {itemsToRender?.map((pokemon) => (
          <PokemonCard key={pokemon.name} name={pokemon.name} />
        ))}
      </ul>

      {isFetching && <p>Cargando más...</p>}
      
      {apiListQuery.isError && (
        <ErrorMessage message={'Error al cargar más pokemones.'} onRetry={handleApiListRetry} />
      )}

      {!apiListQuery.isError && (
        <div ref={sentinelRef} style={{ height: '1px' }} />
      )}
    </div>
  )
}

export default HomePage