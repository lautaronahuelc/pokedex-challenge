import { useGetPokemonDetailQuery } from './pokemonApi'
import TypeBadgeList from './TypeBadgeList'
import StatBars from './StatBars'
import styles from './ComparisonResult.module.css'

function ComparisonColumn({ name }) {
  const { data, isLoading, isError, refetch } = useGetPokemonDetailQuery(name)

  if (isError) {
    return (
      <div className={styles.column}>
        <p>No pudimos cargar {name}.</p>
        <button onClick={refetch}>Reintentar</button>
      </div>
    )
  }

  if (isLoading) return <div className={styles.column}>Cargando...</div>

  return (
    <div className={styles.column}>
      <img src={data.sprites.front_default} alt={data.name} width={120} height={120} />
      <h2 className={styles.name}>{data.name}</h2>
      <TypeBadgeList types={data.types} />
      <p className={styles.measurement}>Altura: {data.height / 10} m</p>
      <p className={styles.measurement}>Peso: {data.weight / 10} kg</p>
      <StatBars stats={data.stats} />
    </div>
  )
}

function ComparisonResult({ nameA, nameB }) {
  return (
    <div className={styles.grid}>
      <ComparisonColumn name={nameA} />
      <ComparisonColumn name={nameB} />
    </div>
  )
}

export default ComparisonResult