import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetPokemonDetailQuery } from './pokemonApi'
import PokemonCardSkeleton from './PokemonCardSkeleton'
import TypeBadgeList from './TypeBadgeList'
import FavoriteButton from '../favorites/FavoriteButton'
import styles from './PokemonCard.module.css'
import StatBars from './StatBars'

function PokemonCard({ showStats, name }) {
  const { data, isLoading, isError } = useGetPokemonDetailQuery(name)
  const favorites = useSelector(state => state.favorites)
  const isFavorite = favorites.names.some((n) => n === name)

  if (isLoading) return <PokemonCardSkeleton showStats={showStats} />
  if (isError) return <li className={styles.card}>Error al cargar</li>

  return (
    <li
      className={`${styles.card} ${isFavorite ? styles.liked : ''}`}
    >
      <div className={styles.favorite}>
        <FavoriteButton name={data.name} />
      </div>

      <Link to={`/pokemon/${data.name}`} className={styles.link}>
        <div className={styles.grid}>
          <img
            className={styles.sprite}
            src={data.sprites.front_default}
            alt={data.name}
            width={124}
            height={124}
          />
          <p className={styles.number}>N°{data.id}</p>
          <p className={styles.name}>{data.name}</p>
          <TypeBadgeList types={data.types} />
        </div>

        
        {showStats && (
          <div className={styles.statsContainer}>
            <div>
              <p className={styles.measurement}>Altura: {data.height / 10} m</p>
              <p className={styles.measurement}>Peso: {data.weight / 10} kg</p>
            </div>
            <StatBars stats={data.stats} />
          </div>
        )}
      </Link>
    </li>
  )
}

export default PokemonCard