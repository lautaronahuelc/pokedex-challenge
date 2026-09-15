import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useOnlineStatus from '../../hooks/UseOnlineStatus'
import styles from './Header.module.css'

function Header() {
  const isOnline = useOnlineStatus()

  const isFetchingAnything = useSelector((state) =>
    Object.values(state.pokeApi.queries).some((query) => query?.status === 'pending')
  )

  const statusLabel = !isOnline ? 'Sin conexión' : isFetchingAnything ? 'Actualizando...' : 'Al día'


  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.logo}>
        Pokedex
      </NavLink>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Inicio
        </NavLink>
        <NavLink
          to="/team"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Mi Equipo
        </NavLink>
        <NavLink
          to="/compare"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Comparar
        </NavLink>
      </nav>

      <div className={`${styles.status} ${!isOnline ? styles.offline : ''}`} aria-live="polite">
        <span className={styles.statusDot} />
        {statusLabel}
      </div>
    </header>
  )
}

export default Header