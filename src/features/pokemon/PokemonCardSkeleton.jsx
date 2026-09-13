import styles from './PokemonCard.module.css'
import skeletonStyles from './PokemonCardSkeleton.module.css'

function PokemonCardSkeleton() {
  return (
    <li className={styles.card}>
      <div className={`${skeletonStyles.pulse} ${skeletonStyles.sprite}`} />
      <div className={`${skeletonStyles.pulse} ${skeletonStyles.number}`} style={{ width: '48px' }} />
      <div className={`${skeletonStyles.pulse} ${skeletonStyles.name}`} style={{ width: '96px' }} />
      <div className={styles.badges}>
        <div className={`${skeletonStyles.pulse} ${skeletonStyles.badge}`} />
        <div className={`${skeletonStyles.pulse} ${skeletonStyles.badge}`} />
      </div>
    </li>
  )
}

export default PokemonCardSkeleton