import { useParams } from 'react-router-dom'

function DetailPage() {
  const { name } = useParams()

  return <p>Detalle de {name} (todavía no implementado)</p>
}

export default DetailPage