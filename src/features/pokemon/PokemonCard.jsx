import { useGetPokemonDetailQuery } from './pokemonApi'
import { extractIdFromUrl } from './utils'
import styles from './pokemonCard.module.css'

function PokemonCard({ url }) {
  const id = extractIdFromUrl(url)
  const { data, isLoading, isError } = useGetPokemonDetailQuery(id)

  if (isLoading) return <li className={styles.card}>Cargando Pokemon Detail</li>
  if (isError) return <li className={styles.card}>Error al cargar</li>

  return (
    <li className={styles.card}>
      <img
        className={styles.sprite}
        src={data.sprites.other.showdown.front_default}
        alt={data.name}
        width={96}
        height={96}
      />
      <p className={styles.number}>#{data.id}</p>
      <p className={styles.name}>{data.name}</p>
      <ul className={styles.badges}>
        {data.types.map(({ type }) => (
          <li
            key={type.name}
            className={styles.badge}
            style={{ '--badge-color': `var(--type-${type.name})` }}
          >
            {type.name}
          </li>
        ))}
      </ul>
    </li>
  )
}

export default PokemonCard