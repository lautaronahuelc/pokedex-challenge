import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const DEBOUNCE_MS = 300

function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [inputValue, setInputValue] = useState(searchParams.get('search') ?? '')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      if (inputValue) {
        next.set('search', inputValue)
      } else {
        next.delete('search')
      }
      setSearchParams(next)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [inputValue])

  return (
    <input
      type="text"
      placeholder="Buscar pokémon..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  )
}

export default SearchBar