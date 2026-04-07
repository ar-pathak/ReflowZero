import { createSlice } from '@reduxjs/toolkit';

// Browser ke LocalStorage se purana data nikalne ka function
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reflow_watchlist');
    if (serializedState === null) {
      return []; // Agar pehli baar aaya hai toh empty array
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

export const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    favorites: loadState(),
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const symbol = action.payload;
      const index = state.favorites.indexOf(symbol);
      
      if (index >= 0) {
        // Agar pehle se favorite hai, toh usko remove kar do
        state.favorites.splice(index, 1);
      } else {
        // Agar favorite nahi hai, toh add kar do
        state.favorites.push(symbol);
      }
      
      // State change hone ke turant baad LocalStorage update kar do
      localStorage.setItem('reflow_watchlist', JSON.stringify(state.favorites));
    },
  },
});

export const { toggleFavorite } = watchlistSlice.actions;
export default watchlistSlice.reducer;