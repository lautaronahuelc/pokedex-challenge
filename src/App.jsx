import { useState } from 'react'
import { useGetPokemonListQuery } from './features/pokemon/pokemonApi'

function App() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError, error } = useGetPokemonListQuery(page)

  if (isLoading) return <p>Cargando...</p>
  if (isError) return <p>Error: {error.status}</p>

  return (
    <div>
      <ul>
        {data.results.map((pokemon) => (
          <li key={pokemon.name}>{pokemon.name}</li>
        ))}
      </ul>
      <button onClick={() => setPage((p) => p + 1)}>Cargar más</button>
    </div>
  )
}

export default App
