import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetPokemonDetailQuery } from './pokemonApi'
import PokemonCardSkeleton from './PokemonCardSkeleton'
import TypeBadgeList from './TypeBadgeList'
import FavoriteButton from '../favorites/FavoriteButton'
import styles from './pokemonCard.module.css'

function PokemonCard({ name }) {
  const { data, isLoading, isError } = useGetPokemonDetailQuery(name)
  const favorites = useSelector(state => state.favorites)
  const isFavorite = favorites.names.some((n) => n === name)

  if (isLoading) return <PokemonCardSkeleton />
  if (isError) return <li className={styles.card}>Error al cargar</li>

  return (
    <li
      className={`${styles.card} ${isFavorite ? styles.liked : ''}`}
    >
      <div className={styles.favorite}>
        <FavoriteButton name={data.name} />
      </div>
      <Link to={`/pokemon/${data.name}`} className={styles.link}>
        <img
          className={styles.sprite}
          src={data.sprites.other.showdown.front_default}
          alt={data.name}
          width={72}
          height={72}
        />
        <p className={styles.number}>N°{data.id}</p>
        <p className={styles.name}>{data.name}</p>
        <TypeBadgeList types={data.types} />
      </Link>
    </li>
  )
}

export default PokemonCard