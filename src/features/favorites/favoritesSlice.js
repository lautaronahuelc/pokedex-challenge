import { createSlice } from '@reduxjs/toolkit'

export const MAX_FAVORITES = 6

const initialState = {
  names: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const name = action.payload
      const alreadyExists = state.names.includes(name)
      const isFull = state.names.length >= MAX_FAVORITES

      if (alreadyExists || isFull) return

      state.names.push(name)
    },
    removeFavorite: (state, action) => {
      const name = action.payload
      state.names = state.names.filter((n) => n !== name)
    },
  },
})

export const { addFavorite, removeFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer