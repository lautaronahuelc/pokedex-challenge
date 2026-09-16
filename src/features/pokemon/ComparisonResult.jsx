import { useGetPokemonDetailQuery } from './pokemonApi'
import TypeBadgeList from './TypeBadgeList'
import StatBars from './StatBars'
import styles from './ComparisonResult.module.css'
import ErrorMessage from '../../components/shared/ErrorMessage'
import PokemonCard from './PokemonCard'

function ComparisonColumn({ name }) {
  const { data, isLoading, isError, refetch } = useGetPokemonDetailQuery(name)

  if (isError) {
    return (
      <div className={styles.column}>
        <ErrorMessage message={`No pudimos cargar ${name}.`} onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className={styles.column}>
      <PokemonCard name={name} showStats />
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