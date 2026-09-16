import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useGetAllPokemonNamesQuery } from '../features/pokemon/pokemonApi'
import ComparisonResult from '../features/pokemon/ComparisonResult'
import PokemonCombobox from '../features/pokemon/PokemonCombobox'
import Button from '../components/shared/Button'
import styles from './ComparePage.module.css'

const compareSchema = Yup.object({
  pokemonA: Yup.string().required('Elegí un pokémon'),
  pokemonB: Yup.string()
    .required('Elegí un pokémon')
    .notOneOf([Yup.ref('pokemonA')], 'Elegí un pokémon distinto al primero'),
})

function ComparePage() {
  const { data: allNames, isLoading } = useGetAllPokemonNamesQuery()
  const [comparison, setComparison] = useState(null)

  if (isLoading) return <p>Cargando catálogo...</p>

  return (
    <div className={styles.page}>
      <Formik
        initialValues={{ pokemonA: '', pokemonB: '' }}
        validationSchema={compareSchema}
        onSubmit={(values) => {
          setComparison({ nameA: values.pokemonA, nameB: values.pokemonB })
        }}
      >
        <Form className={styles.form}>
          <PokemonCombobox name="pokemonA" label="Pokémon 1" allNames={allNames} />
          <PokemonCombobox name="pokemonB" label="Pokémon 2" allNames={allNames} />
          <Button type="submit">Comparar</Button>
        </Form>
      </Formik>

      {comparison && <ComparisonResult nameA={comparison.nameA} nameB={comparison.nameB} />}
    </div>
  )
}

export default ComparePage