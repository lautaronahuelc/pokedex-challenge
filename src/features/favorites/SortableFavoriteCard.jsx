import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PokemonCard from '../pokemon/PokemonCard'
import styles from './SortableFavoriteCard.module.css'

function SortableFavoriteCard({ name }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: name,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.wrapper} {...attributes} {...listeners}>
      <PokemonCard name={name} />
    </div>
  )
}

export default SortableFavoriteCard