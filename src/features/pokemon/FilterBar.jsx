import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetTypeListQuery, useGetGenerationListQuery } from './pokemonApi'
import styles from './FilterBar.module.css'
import CustomSelect from '../../components/shared/CustomSelect'

const ROMAN_TO_NUMBER = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9 }
const NUMBER_TO_ROMAN = Object.fromEntries(
  Object.entries(ROMAN_TO_NUMBER).map(([roman, num]) => [num, roman])
)

function FilterBar() {
  const { data: types, isLoading: isLoadingTypes } = useGetTypeListQuery()
  const { data: generations, isLoading: isLoadingGenerations } = useGetGenerationListQuery()
  
  const [searchParams, setSearchParams] = useSearchParams()
  const typeParam = searchParams.get('type') ?? ''
  const generationParamNumber = searchParams.get('generation') ?? ''
  const generationParamName = generationParamNumber
    ? `generation-${NUMBER_TO_ROMAN[generationParamNumber]}`
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

  if (isLoadingTypes || isLoadingGenerations) {
    return null;
  }

  const normalizedTypes = (types || []).map((t) => ({ value: t.name, label: t.name }))
  const allTypes = [{ value: '', label: 'Todos los tipos'}, ...normalizedTypes]

  const normalizedGenerations = (generations || []).map((g) => ({ value: g.name, label: g.name }))
  const allGenerations = [{ value: '', label: 'Todas las generaciones'}, ...normalizedGenerations]

  const handleOnChangeType = (selectedOption) => {
    updateParam('type', selectedOption.value)
  }

  const handleOnChangeGeneration = (selectedOption) => {
    const roman = selectedOption.value.replace('generation-', '')
    updateParam('generation', ROMAN_TO_NUMBER[roman] ?? '')
  }

  return (
    <div className={styles.container}>
      <CustomSelect options={allTypes} value={typeParam} onChange={handleOnChangeType} />
      <CustomSelect options={allGenerations} value={generationParamName} onChange={handleOnChangeGeneration} />
    </div>
  )
}

export default FilterBar