import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { pokeApi } from '../api/pokeApi'
import favoritesReducer from '../features/favorites/favoritesSlice'
import apiPagereducer from '../features/pokemon/pageSlice'

const favoritesPersistConfig = {
  key: 'favorites',
  storage,
}

export const store = configureStore({
  reducer: {
    [pokeApi.reducerPath]: pokeApi.reducer,
    favorites: persistReducer(favoritesPersistConfig, favoritesReducer),
    apiPage: apiPagereducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    }).concat(pokeApi.middleware),
})

export const persistor = persistStore(store)