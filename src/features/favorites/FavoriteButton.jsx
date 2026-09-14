import { useSelector, useDispatch } from 'react-redux'
import { addFavorite, removeFavorite, MAX_FAVORITES } from './favoritesSlice'
import styles from './FavoriteButton.module.css'

function FavoriteButton({ name }) {
  const dispatch = useDispatch()
  const favoriteNames = useSelector((state) => state.favorites.names)

  const isFavorite = favoriteNames.includes(name)
  const isFull = favoriteNames.length >= MAX_FAVORITES

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorite) {
      dispatch(removeFavorite(name))
    } else if (!isFull) {
      dispatch(addFavorite(name))
    }
  }

  return (
    <button
      className={isFavorite ? styles.active : styles.inactive}
      onClick={handleClick}
      disabled={!isFavorite && isFull}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      title={!isFavorite && isFull ? 'Ya tenés 6 favoritos' : undefined}
    >
      ★
    </button>
  )
}

export default FavoriteButton