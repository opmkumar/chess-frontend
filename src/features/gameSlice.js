import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  color: "white",
  gameId: null,
  games: [],
  isLoading: false,
  error: null,
};

export const getUserCompletedGames = createAsyncThunk(
  "userCompletedGames",
  async () => {
    try {
      const id = sessionStorage.getItem("id");
      console.log("user id ", id);
      const res = await fetch(`/api/v1/games/completedGames/${id}`);
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    challengeAccepted(state, action) {
      state.color = action.payload.color;
      state.gameId = action.payload.gameId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserCompletedGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserCompletedGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.games = action.payload.data.games;
      })
      .addCase(getUserCompletedGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? action.payload.error
          : action.error.message;
      });
  },
});

export const { challengeAccepted } = gameSlice.actions;

export default gameSlice.reducer;
