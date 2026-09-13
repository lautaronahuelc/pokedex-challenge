import { Link } from 'react-router-dom'
import { useGetPokemonDetailQuery } from './pokemonApi'
import PokemonCardSkeleton from './PokemonCardSkeleton'
import styles from './pokemonCard.module.css'

function PokemonCard({ name }) {
  const { data, isLoading, isError } = useGetPokemonDetailQuery(name)

  if (isLoading) return <PokemonCardSkeleton />
  if (isError) return <li className={styles.card}>Error al cargar</li>

  return (
    <li className={styles.card}>
      <Link to={`/pokemon/${data.name}`} className={styles.link}>
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
      </Link>
    </li>
  )
}

export default PokemonCard