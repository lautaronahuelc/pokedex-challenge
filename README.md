# Pokedex — Challenge DCAC

Pokedex construida con React 18 + Vite 5, Redux Toolkit + RTK Query, redux-persist, React Router v6, Formik + Yup y CSS Modules. JavaScript puro, sin TypeScript. Datos de [PokeAPI](https://pokeapi.co).

## Netlify Deploy

[https://acdc-challenge.netlify.app/?search=pikachu&type=electric&generation=1](https://acdc-challenge.netlify.app/?search=pikachu&type=electric&generation=1)

## Instalación y ejecución local

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

Otros scripts disponibles:

```bash
npm run build     # build de producción
npm run preview   # sirve el build de producción localmente
npm run lint      # ESLint
```

## Stack (versiones fijas)

- React 18.3.1
- Vite 5.4.21
- @reduxjs/toolkit 1.9.7
- react-redux 8.1.3
- react-router-dom 6.30.6
- redux-persist 6.0.0
- formik 2.4.9 / yup 1.7.1
- @dnd-kit/core 6.3.1, @dnd-kit/sortable 10.0.0, @dnd-kit/utilities 3.2.2

## Funcionalidades

- Listado con infinite scroll (`IntersectionObserver`), sprite/nombre/número/tipos por card, skeletons sin layout shift
- Vista de detalle: sprites alternativos, stats con barras, tipos, habilidades, altura/peso
- Buscador con debounce (300ms) + filtros por tipo y generación, combinables, persistidos en query params
- "Mi Equipo": favoritos con límite de 6, reordenables por drag & drop (`@dnd-kit`), persistidos en localStorage
- Comparador de 2 pokémon con Formik + Yup, no permite comparar el mismo
- RTK Query para toda la data, con tags de invalidación por dominio
- Header con navegación activa e indicador de conexión / actividad de red
- Toasts para acciones sobre favoritos
- Manejo de error con reintento en listado, detalle y comparador

## Decisiones técnicas

### Arquitectura de RTK Query

`src/api/pokeApi.js` define solo lo transversal: `reducerPath`, `baseQuery` (con la `baseUrl` de la PokeAPI) y `tagTypes`. Los endpoints se agregan por feature vía `injectEndpoints` (`src/features/pokemon/pokemonApi.js`), evitando un único archivo con todos los endpoints de la app mezclados.

**Identificador canónico: `name`, no `id`.** Al principio, algunos endpoints usaban el `id` numérico extraído de una URL y otros el `name` — eso generaba dos entradas de cache distintas para el mismo pokémon (RTK Query arma la key de cache serializando el argumento tal cual, sin saber que `25` y `"pikachu"` son el mismo recurso). Se unificó todo el flujo (fetch, tags, rutas) a usar siempre `name`, que además es más legible en la URL.

**Paginación de infinite scroll.** La PokeAPI pagina por `offset`/`limit`, no por número de página, y RTK Query trata cada combinación de argumentos como cache independiente por default. Se resuelve combinando `serializeQueryArgs` (todas las páginas comparten una key), `merge` (concatena resultados nuevos sobre el cache existente, mutando vía Immer) y `forceRefetch` (fuerza el pedido cuando cambia el argumento de página).

**Cards del listado: patrón N+1 deliberado.** El endpoint de listado no trae sprite ni tipos — cada `PokemonCard` pide su propio detalle con `useGetPokemonDetailQuery(name)`. Se evaluó evitar esto armando la URL del sprite a mano, pero esa alternativa no resuelve los tipos (no hay endpoint bulk). La ventaja del enfoque elegido: el detalle de cada pokémon visto en el listado ya queda cacheado al entrar al detalle completo, sin fetch adicional.

**Tags de invalidación, sin mutaciones.** `tagTypes` está diseñado con granularidad decidida caso por caso: tag genérico para colecciones que se tratan como una sola entidad (`PokemonList`, todas las páginas comparten uno), tag con id específico para entidades individuales (`{ type: 'PokemonDetail', id: name }`, para no invalidar 20 detalles por el cambio de uno). No se implementan mutaciones porque la PokeAPI es de solo lectura — no hay ninguna acción de la app que debiera invalidar un tag realmente. El sistema queda listo para el día que exista un endpoint de escritura real; solo haría falta sumar `invalidatesTags` ahí.

**`keepUnusedDataFor` en catálogos.** `getTypeList`, `getGenerationList` y `getAllPokemonNames` alimentan selectores y buscadores con datos que prácticamente no cambian en una sesión. Se sube `keepUnusedDataFor` a 3600s (vs. el default de 60s) para no re-pedirlos si el usuario interactúa repetidamente con filtros/comparador a lo largo de la sesión.

### Persistencia: favoritos completos, cache de API deliberadamente limitado

**Favoritos (`localStorage`, completo).** `favoritesReducer` se envuelve con `persistReducer` propio (key `'favorites'`), separado del cache de RTK Query — es un dominio simple donde toda la data debe sobrevivir indefinidamente al refresh.

**Cache de RTK Query: se intentó persistir completo y se descartó por costo/beneficio.** Se probó envolver `pokeApi.reducer` con `persistReducer`, con `blacklist` sobre las claves internas que no aportan nada persistidas (`subscriptions`, `mutations`, `config`, `provided`). El problema no fue ese blacklist estructural, sino el volumen de datos: navegando con normalidad (varias páginas de scroll + un par de detalles + los catálogos de filtros/comparador), el tamaño persistido llegó a **~5MB en localStorage**, cerca del límite del navegador, y la rehidratación al arrancar tardaba **entre 5 y 20 segundos** con la pantalla en blanco — peor experiencia que no persistir nada.

Se diseñó una solución con `createTransform` para persistir selectivamente (excluir `getPokemonList`/`getAllPokemonNames` por ser baratos de re-pedir, y acotar `getPokemonDetail` a las N entradas más recientes por `fulfilledTimeStamp`). La lógica de filtrado se validó de forma aislada (fuera de Redux, con datos mock) y funcionó correctamente, pero la integración con `redux-persist` en runtime no llegó a comportarse como se esperaba en el tiempo disponible (el filtro no excluía lo que debía, sin llegar a identificar la causa raíz exacta antes de la fecha de entrega). Se decidió priorizar tiempo y **dejar sin persistir el cache general de la API**, documentando el diagnóstico completo para retomarlo (ver "Mejoras futuras").

**Por qué esto no invalida el indicador de "cacheado vs fresco".** Ese indicador es sobre el cache **en memoria** de RTK Query (dentro de la sesión, sin refrescar), no sobre persistencia en disco — son dos mecanismos independientes. Se implementó en `DetailPage` comparando `fulfilledTimeStamp` contra el momento actual: si es de hace menos de 1 segundo, se asume que el dato se acaba de pedir a la red; si es más viejo, viene de una entrada ya existente en memoria. No está implementado en el listado por tener múltiples queries de detalle simultáneas (una por card), lo que complica un indicador único y representativo ahí.

### CSS: CSS Modules en vez de Styled Components

Elegido por cero costo de runtime (CSS Modules compila a CSS plano en build time), compatibilidad directa con React 18 (Styled Components requiere v6+), y porque lo "dinámico" (color de badges, ancho de barras de stats) se resuelve igual con CSS custom properties seteadas inline (`style={{ '--badge-color': color }}`) sin pagar el costo de una librería de CSS-in-JS.

### Estructura de carpetas

`src/pages/` para componentes de ruta completa (pegamento entre features y layout). `src/features/<dominio>/` para lógica y componentes reusables por dominio (endpoints, slices, componentes específicos). `src/components/layout/` y `src/components/toast/` para piezas transversales a toda la app. `src/hooks/` para hooks genéricos sin dominio propio (ej. `useOnlineStatus`).

### Toasts: Context, no Redux

Los toasts son estado de UI puramente efímero (viven ~3s, no se persisten, no le importan a ninguna otra parte de la lógica de negocio) — se resuelven con Context + `useState` en vez de un slice de Redux, reservando Redux para estado de dominio real (favoritos, cache de API, filtros vía query params).

### Reordenamiento de favoritos: `@dnd-kit`

El enunciado marca drag & drop como opcional, pero se optó por implementarlo (en vez de botones subir/bajar) porque "Mi Equipo" se muestra como grilla bidimensional, donde un control lineal de subir/bajar no mapea de forma intuitiva al movimiento visual esperado. Se usa `@dnd-kit` (mouse, touch y teclado soportados nativamente) con `rectSortingStrategy` para grillas. El array `favorites.names` (decisión tomada desde el Día 5, precisamente pensando en esto) preserva el orden de forma nativa, sin necesitar campos de posición adicionales.

## Bugs conocidos

### 🐛 Infinite scroll se rompe al volver de DetailPage

Al entrar al detalle de un pokémon y volver con "← Volver", el infinite scroll puede duplicar la página 0 o dejar de cargar páginas nuevas. Causa raíz: `page` vive en `useState` dentro de `HomePage`, que se desmonta al navegar — el estado del componente se pierde, pero el cache de RTK Query (global, no se destruye) sigue recordando el último `page` pedido, generando un desencuentro. Se probaron dos fixes (mover `page` a un slice de Redux; recrear el `IntersectionObserver` una sola vez por mount con refs) sin resolverlo completamente en el tiempo disponible — el segundo intento introdujo una regresión donde el observer dejaba de disparar tras la navegación. Se revirtió a la versión original, funcional salvo por este caso.

## Mejoras futuras

**Persistencia y cache**
- Resolver la persistencia selectiva del cache de RTK Query (retomar el diagnóstico del `createTransform`, o evaluar IndexedDB vía `localforage` si el volumen de datos lo justifica una vez acotado el problema de fondo)
- Extender el indicador de cacheado/fresco al listado, no solo a `DetailPage`

**Bugs conocidos** (ver sección anterior)
- Fix del infinite scroll post-navegación al detalle

**Calidad de código**
- PropTypes (o migración a TypeScript) para validar props en desarrollo
- Custom hooks para aislar lógica repetida (ej. el patrón de fetch+loading+error que se repite entre `HomePage`, `DetailPage` y `ComparisonResult`)
- Unificar `PAGE_SIZE` (API) y `CLIENT_PAGE_SIZE` (paginación en cliente) en una única constante compartida
- Revisar consistencia de variables CSS entre módulos (algunos valores quedaron hardcodeados en vez de usar `var(--spacing-*)`)
- Aislar componentes de imagen repetidos (sprite con estado de carga/error) en un componente `PokemonImage` compartido
- Skeleton propio por componente que lo necesite, no solo `PokemonCardSkeleton`
- Tests unitarios, al menos para reducers de Redux y utils de filtrado (`filterPokemon.js`)

**UX y accesibilidad**
- Auditoría de accesibilidad completa (navegación por teclado, roles ARIA, contraste)
- Dark mode (la base de variables CSS en `:root` ya está pensada para permitirlo)
- Responsive: revisión dedicada de breakpoints, hoy apoyada solo en `minmax()`/spacing variables sin puntos de quiebre explícitos

**Performance y arquitectura**
- Code splitting de rutas con `React.lazy` / `Suspense` (hoy todo el bundle se carga de una)
- Error boundary a nivel de app para errores de render no controlados