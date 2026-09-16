import { useSelector, useDispatch } from 'react-redux'
import { useToast } from '../../components/toasts/ToastContext'
import { addFavorite, removeFavorite, MAX_FAVORITES } from './favoritesSlice'
import styles from './FavoriteButton.module.css'

function FavoriteButton({ name }) {
  const dispatch = useDispatch()
  const favoriteNames = useSelector((state) => state.favorites.names)
  const { showToast } = useToast()

  const isFavorite = favoriteNames.includes(name)
  const isFull = favoriteNames.length >= MAX_FAVORITES

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorite) {
      dispatch(removeFavorite(name))
      showToast(`${name} eliminado del equipo`, 'info')
    } else if (!isFull) {
      dispatch(addFavorite(name))
      showToast(`${name} agregado al equipo`, 'success')
    } else {
      showToast('Ya tenés 6 favoritos, sacá uno para agregar otro', 'error')
    }
  }

  return (
    <button
      className={isFavorite ? styles.active : styles.inactive}
      onClick={handleClick}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      title={!isFavorite && isFull ? 'Ya tenés 6 favoritos' : undefined}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z"></path> </g></svg>
    </button>
  )
}

export default FavoriteButton