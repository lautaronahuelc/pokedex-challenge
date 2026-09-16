import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { MAX_FAVORITES, reorderFavorites } from '../features/favorites/favoritesSlice'
import SortableFavoriteCard from '../features/favorites/SortableFavoriteCard'
import styles from './TeamPage.module.css'

function TeamPage() {
  const favoriteNames = useSelector((state) => state.favorites.names)
  const dispatch = useDispatch()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  function handleDragEnd(event) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const fromIndex = favoriteNames.indexOf(active.id)
    const toIndex = favoriteNames.indexOf(over.id)

    dispatch(reorderFavorites({ fromIndex, toIndex }))
  }

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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={favoriteNames} strategy={rectSortingStrategy}>
          <ul className={styles.grid}>
            {favoriteNames.map((name) => (
              <li key={name}>
                <SortableFavoriteCard name={name} />
              </li>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default TeamPage