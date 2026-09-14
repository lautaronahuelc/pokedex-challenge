import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useGetAllPokemonNamesQuery } from '../features/pokemon/pokemonApi'
import ComparisonResult from '../features/pokemon/ComparisonResult'
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
      <h1>Comparar Pokémon</h1>

      <Formik
        initialValues={{ pokemonA: '', pokemonB: '' }}
        validationSchema={compareSchema}
        onSubmit={(values) => {
          setComparison({ nameA: values.pokemonA, nameB: values.pokemonB })
        }}
      >
        <Form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="pokemonA">Pokémon 1</label>
            <Field as="select" name="pokemonA" id="pokemonA">
              <option value="">Seleccioná uno</option>
              {allNames?.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="pokemonA" component="p" className={styles.error} />
          </div>

          <div className={styles.field}>
            <label htmlFor="pokemonB">Pokémon 2</label>
            <Field as="select" name="pokemonB" id="pokemonB">
              <option value="">Seleccioná uno</option>
              {allNames?.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="pokemonB" component="p" className={styles.error} />
          </div>

          <button type="submit">Comparar</button>
        </Form>
      </Formik>

      {comparison && <ComparisonResult nameA={comparison.nameA} nameB={comparison.nameB} />}
    </div>
  )
}

export default ComparePage