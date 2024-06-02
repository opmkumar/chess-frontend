import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./src/features/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
