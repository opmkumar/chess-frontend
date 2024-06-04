import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  color: "white",
  gameId: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    challengeAccepted(state, action) {
      state.color = action.payload.color;
      state.gameId = action.payload.gameId;
    },
  },
});

export const { challengeAccepted } = gameSlice.actions;

export default gameSlice.reducer;
