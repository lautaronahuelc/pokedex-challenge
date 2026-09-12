import { useState, useRef, useEffect, useCallback } from 'react'
import { useGetPokemonListQuery } from './features/pokemon/pokemonApi'
import PokemonCard from './features/pokemon/PokemonCard'

function App() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isFetching, isError, error } = useGetPokemonListQuery(page)

  const observerRef = useRef(null)

  const sentinelRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect()
      if (!node) return

      observerRef.current = new IntersectionObserver((entries) => {
        const isVisible = entries[0].isIntersecting
        if (isVisible && !isFetching) {
          setPage((p) => p + 1)
        }
      })

      observerRef.current.observe(node)
    },
    [isFetching]
  )

  useEffect(() => {
    return () => observerRef.current?.disconnect()
  }, [])

  if (isLoading) return <p>Cargando...</p>
  if (isError) return <p>Error: {error.status}</p>

  return (
    <div>
      <ul>
        {data.results.map((pokemon) => (
          <PokemonCard key={pokemon.name} url={pokemon.url} />
        ))}
      </ul>
      <div ref={sentinelRef} style={{ height: '1px' }} />
      {isFetching && <p>Cargando más...</p>}
    </div>
  )
}

export default App