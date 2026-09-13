import { useSearchParams } from 'react-router-dom'
import { useGetTypeListQuery, useGetGenerationListQuery } from './pokemonApi'

const ROMAN_TO_NUMBER = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9 }
const NUMBER_TO_ROMAN = Object.fromEntries(
  Object.entries(ROMAN_TO_NUMBER).map(([roman, num]) => [num, roman])
)

function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: types } = useGetTypeListQuery()
  const { data: generations } = useGetGenerationListQuery()

  const currentType = searchParams.get('type') ?? ''
  const currentGenerationNumber = searchParams.get('generation') ?? ''
  const currentGenerationName = currentGenerationNumber
    ? `generation-${NUMBER_TO_ROMAN[currentGenerationNumber]}`
    : ''

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next)
  }

  return (
    <div>
      <select value={currentType} onChange={(e) => updateParam('type', e.target.value)}>
        <option value="">Todos los tipos</option>
        {types?.map((t) => (
          <option key={t.name} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        value={currentGenerationName}
        onChange={(e) => {
          const roman = e.target.value.replace('generation-', '')
          updateParam('generation', ROMAN_TO_NUMBER[roman] ?? '')
        }}
      >
        <option value="">Todas las generaciones</option>
        {generations?.map((g) => (
          <option key={g.name} value={g.name}>
            {g.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterBar