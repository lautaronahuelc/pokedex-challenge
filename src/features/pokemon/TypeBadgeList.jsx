import styles from './TypeBadgeList.module.css'

function TypeBadgeList({ types }) {
  return (
    <ul className={styles.badges}>
      {types.map(({ type }) => (
        <li
          key={type.name}
          className={styles.badge}
          style={{ '--badge-color': `var(--type-${type.name})` }}
        >
          {type.name}
        </li>
      ))}
    </ul>
  )
}

export default TypeBadgeList