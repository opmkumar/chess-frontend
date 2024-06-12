import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  email: "",
  password: "",
  isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
  isLoading: false,
  error: null,
  otp: null,
};

export const createUser = createAsyncThunk(
  "createUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/v1/users/signup", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials (cookies) in the request
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error);
      }
      const result = await res.json();
      sessionStorage.setItem("jwt", result.token);
      sessionStorage.setItem("id", result.data.user._id);
      return result;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  },
);
export const getUser = createAsyncThunk(
  "getUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/v1/users/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials (cookies) in the request
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error);
      }
      const result = await res.json();
      sessionStorage.setItem("jwt", result.token);
      sessionStorage.setItem("id", result.data.user._id);

      return result;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  },
);
export const verifyOtp = createAsyncThunk(
  "verifyOtp",
  async (data, { rejectWithValue }) => {
    const token = sessionStorage.getItem("jwt");
    console.log(token);
    try {
      const res = await fetch("/api/v1/users/verify-otp", {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include", // Include credentials (cookies) in the request

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("hello");

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error);
      }
      const result = await res.json();
      sessionStorage.setItem("isAuthenticated", "true");
      console.log("everything worked", result);
      return result;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      sessionStorage.setItem("isAuthenticated", "true");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("id");
      sessionStorage.removeItem("jwt");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.password = action.payload.password;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? action.payload.error
          : action.error.message;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.password = action.payload.password;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? action.payload.error
          : action.error.message;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otp = action.payload.otp;
        state.isAuthenticated = true;
        state.username = action.payload.data.user.username;
        state.email = action.payload.data.user.email;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? action.payload.error
          : action.error.message;
      });
  },
});

// console.log(userSlice);

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
