import { useGetPokemonListQuery } from './features/pokemon/pokemonApi'

function App() {
  const { data, isLoading, isError, error } = useGetPokemonListQuery()

  if (isLoading) return <p>Cargando...</p>
  if (isError) return <p>Error: {error.status}</p>

  return (
    <ul>
      {data.results.map((pokemon) => (
        <li key={pokemon.name}>{pokemon.name}</li>
      ))}
    </ul>
  )
}

export default App
