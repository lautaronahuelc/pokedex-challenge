import { useParams, Link } from 'react-router-dom'
import { useGetPokemonDetailQuery } from '../features/pokemon/pokemonApi'
import TypeBadgeList from '../features/pokemon/TypeBadgeList'
import StatsBar from '../features/pokemon/StatBars'
import styles from './DetailPage.module.css'

function DetailPage() {
  const { name } = useParams()
  const { data, isLoading, isError, refetch, fulfilledTimeStamp } = useGetPokemonDetailQuery(name)

  const isFreshData = fulfilledTimeStamp && Date.now() - fulfilledTimeStamp < 1000

  if (isError) {
    return (
      <div className={styles.page}>
        <p>No pudimos cargar este pokémon.</p>
        <button onClick={refetch}>Reintentar</button>
      </div>
    )
  }

  if (isLoading) return <p className={styles.page}>Cargando...</p>

  const alternateSprites = [
    data.sprites.front_default,
    data.sprites.front_shiny,
    data.sprites.back_default,
    data.sprites.back_shiny,
  ].filter(Boolean)

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        ← Volver
      </Link>

      {!isLoading && (
        <p className={styles.cacheStatus}>
          {isFreshData ? '🟢 Datos recién actualizados' : '🔵 Datos desde cache'}
        </p>
      )}

      <div className={styles.header}>
        <img
          src={data.sprites.front_default}
          alt={data.name}
          width={160}
          height={160}
          className={styles.mainSprite}
        />
        <div className={styles.headerInfo}>
          <p className={styles.number}>#{data.id}</p>
          <h1 className={styles.name}>{data.name}</h1>
          <TypeBadgeList types={data.types} />
        </div>
      </div>

      <section className={styles.section}>
        <h2>Sprites</h2>
        <div className={styles.spriteGallery}>
          {alternateSprites.map((src) => (
            <img key={src} src={src} alt={data.name} width={80} height={80} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Medidas</h2>
        <ul className={styles.measurements}>
          <li>Altura: {data.height / 10} m</li>
          <li>Peso: {data.weight / 10} kg</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Habilidades</h2>
        <ul className={styles.abilities}>
          {data.abilities.map(({ ability, is_hidden }) => (
            <li key={ability.name}>
              {ability.name}
              {is_hidden && <span className={styles.hiddenTag}> (oculta)</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Stats</h2>
        <StatsBar stats={data.stats} />
      </section>
    </div>
  )
}

export default DetailPage