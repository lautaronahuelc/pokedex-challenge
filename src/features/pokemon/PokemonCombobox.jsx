import { useState, useEffect, useRef } from 'react'
import { useField } from 'formik'
import styles from './PokemonCombobox.module.css'

const MAX_SUGGESTIONS = 10

function PokemonCombobox({ name, label, allNames }) {
  const [field, meta, helpers] = useField(name)
  const [query, setQuery] = useState(field.value || '')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = query
    ? allNames.filter((p) => p.name.includes(query.toLowerCase())).slice(0, MAX_SUGGESTIONS)
    : allNames.slice(0, MAX_SUGGESTIONS)

  function handleChange(e) {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)

    if (value !== field.value) {
      helpers.setValue('', true)
    }
  }

  function handleSelect(selectedName) {
    helpers.setValue(selectedName, true)
    helpers.setTouched(true)
    setQuery(selectedName)
    setIsOpen(false)
  }

  return (
    <div className={styles.field} ref={containerRef}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type="text"
        autoComplete="off"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => helpers.setTouched(true)}
        placeholder="Buscar pokémon..."
      />

      {isOpen && filtered.length > 0 && (
        <ul className={styles.dropdown}>
          {filtered.map((p) => (
            <li key={p.name}>
              <button type="button" onMouseDown={() => handleSelect(p.name)}>
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {meta.touched && meta.error && <p className={styles.error}>{meta.error}</p>}
    </div>
  )
}

export default PokemonCombobox