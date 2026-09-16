import styles from './PokemonCard.module.css'
import skeletonStyles from './PokemonCardSkeleton.module.css'

function PokemonCardSkeleton({ showStats }) {
  return (
    <li className={`${styles.card} ${skeletonStyles.container}`}>
      <div className={skeletonStyles.mainSection}>
        <div className={`${skeletonStyles.pulse} ${skeletonStyles.sprite}`} />
        <div className={`${skeletonStyles.pulse} ${skeletonStyles.number}`} style={{ width: '48px' }} />
        <div className={`${skeletonStyles.pulse} ${skeletonStyles.name}`} style={{ width: '96px' }} />
        <div className={skeletonStyles.badges}>
          <div className={`${skeletonStyles.pulse} ${skeletonStyles.badge}`} />
          <div className={`${skeletonStyles.pulse} ${skeletonStyles.badge}`} />
        </div>
      </div>
      {showStats && (
        <div className={skeletonStyles.statsSection}>
          <div className={skeletonStyles.mesurements}>
            <div className={`${skeletonStyles.pulse} ${skeletonStyles.height}`} />
            <div className={`${skeletonStyles.pulse} ${skeletonStyles.weight}`} />
          </div>
          <div className={`${skeletonStyles.pulse} ${skeletonStyles.stats}`} />
        </div>
      )}
    </li>
  )
}

export default PokemonCardSkeleton