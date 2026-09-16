import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
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
      <ul className={styles.grid}>
        {favoriteNames.map((name) => (
          <PokemonCard key={name} name={name} />
        ))}
      </ul>
    </div>
  )
}

export default TeamPage