import { useGetPokemonDetailQuery } from './pokemonApi'
import { extractIdFromUrl } from './utils'

function PokemonCard({ url }) {
  const id = extractIdFromUrl(url)
  const { data, isLoading, isError } = useGetPokemonDetailQuery(id)

  if (isLoading) return <li>Cargando Pokemon Detail</li>
  if (isError) return <li>Error al cargar</li>

  return (
    <li>
      <img src={data.sprites.other.showdown.front_default} alt={data.name} width={96} height={96} />
      <p>#{data.id} {data.name}</p>
      <p>{data.types.map((t) => t.type.name).join(', ')}</p>
    </li>
  )
}

export default PokemonCard