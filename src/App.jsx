import { useState, useRef, useEffect, useCallback } from 'react'
import { useGetPokemonListQuery } from './features/pokemon/pokemonApi'
import PokemonCard from './features/pokemon/PokemonCard'

function App() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isFetching, isError, error, refetch } = useGetPokemonListQuery(page)

  const observerRef = useRef(null)

  const sentinelRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect()
      if (!node) return

      observerRef.current = new IntersectionObserver((entries) => {
        const isVisible = entries[0].isIntersecting
        if (isVisible && !isFetching && !isError) {
          setPage((p) => p + 1)
        }
      })

      observerRef.current.observe(node)
    },
    [isFetching, isError]
  )

  useEffect(() => {
    return () => observerRef.current?.disconnect()
  }, [])

  if (isError && !data) {
    return (
      <div>
        <p>No pudimos cargar los pokemones.</p>
        <button onClick={refetch}>Reintentar</button>
      </div>
    )
  }

  if (isLoading) return <p>Cargando...</p>
  
  return (
    <div>
      <ul>
        {data.results.map((pokemon) => (
          <PokemonCard key={pokemon.name} url={pokemon.url} />
        ))}
      </ul>

      {isFetching && <p>Cargando más...</p>}
      
      {isError && !isFetching && (
        <div>
          <p>No pudimos cargar más pokemones.</p>
          <button onClick={refetch}>Reintentar</button>
        </div>
      )}

      <div ref={sentinelRef} style={{ height: '1px' }} />
    </div>
  )
}

export default App