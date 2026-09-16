import { NavLink } from 'react-router-dom'
import useOnlineStatus from '../../hooks/useOnlineStatus'
import styles from './Header.module.css'
import useBreakpoints from '../../hooks/useBreakpoints'

function Header() {
  const { isTablet, isDesktop } = useBreakpoints();

  const isOnline = useOnlineStatus()
  const statusLabel = !isOnline ? 'Sin conexión' : 'Conectado'

  return (
    <header className={styles.header}>
      {(isTablet || isDesktop) && (
        <NavLink to="/" className={styles.logo}>
          Pokedex
        </NavLink>
      )}

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
        {isDesktop && statusLabel}
      </div>
    </header>
  )
}

export default Header