import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { MAX_FAVORITES } from '../features/favorites/favoritesSlice'
import PokemonCard from '../features/pokemon/PokemonCard'
import styles from './TeamPage.module.css'

function TeamPage() {
  const favoriteNames = useSelector((state) => state.favorites.names)

  if (favoriteNames.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Todavía no armaste tu equipo.</p>
        <Link to="/">Ir a buscar pokémon</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>
        Mi Equipo ({favoriteNames.length}/{MAX_FAVORITES})
      </h1>
      <ul className={styles.grid}>
        {favoriteNames.map((name) => (
          <PokemonCard key={name} name={name} />
        ))}
      </ul>
    </div>
  )
}

export default TeamPage