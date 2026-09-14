import { Link } from 'react-router-dom'
import { useGetPokemonDetailQuery } from './pokemonApi'
import PokemonCardSkeleton from './PokemonCardSkeleton'
import TypeBadgeList from './TypeBadgeList'
import FavoriteButton from '../favorites/FavoriteButton'
import styles from './pokemonCard.module.css'

function PokemonCard({ name }) {
  const { data, isLoading, isError } = useGetPokemonDetailQuery(name)

  if (isLoading) return <PokemonCardSkeleton />
  if (isError) return <li className={styles.card}>Error al cargar</li>

  return (
    <li className={styles.card}>
      <FavoriteButton name={data.name} />
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
        <TypeBadgeList types={data.types} />
      </Link>
    </li>
  )
}

export default PokemonCard