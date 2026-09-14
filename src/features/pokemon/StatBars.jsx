import styles from './StatBars.module.css'

const MAX_STAT_VALUE = 255

const STAT_LABELS = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Especial',
  'special-defense': 'Def. Especial',
  speed: 'Velocidad',
}

function StatBars({ stats }) {
  return (
    <ul className={styles.stats}>
      {stats.map((stat) => (
        <li key={stat.stat.name} className={styles.statRow}>
          <span className={styles.statLabel}>{STAT_LABELS[stat.stat.name] ?? stat.stat.name}</span>
          <div className={styles.statBarTrack}>
            <div
              className={styles.statBarFill}
              style={{ '--bar-width': `${(stat.base_stat / MAX_STAT_VALUE) * 100}%` }}
            />
          </div>
          <span className={styles.statValue}>{stat.base_stat}</span>
        </li>
      ))}
    </ul>
  )
}

export default StatBars