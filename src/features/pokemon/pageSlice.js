import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  number: 0,
}

const apiPageSlice = createSlice({
  name: 'apiPage',
  initialState,
  reducers: {
    nextPage: (state) => {
      state.number += 1
    },
  },
})

export const { nextPage } = apiPageSlice.actions
export default apiPageSlice.reducer