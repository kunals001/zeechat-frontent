import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

//types
import type{User} from '../type'
type ErrorPayload = string;

axios.defaults.withCredentials = true;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isCheckingAuth: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  isCheckingAuth: false,
};


/// Signup

export const signup = createAsyncThunk<User, {fullName: string; userName: string; email: string; password: string;}, { rejectValue: ErrorPayload }>('auth/signup', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, data);
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.message || "Signup failed");
    }
  }
});


/// Verify Email

export const verifyEmail = createAsyncThunk<User,{code: string},{ rejectValue: ErrorPayload }>('auth/verify-email', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/verify-email`, data);
    return response.data.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
});


/// Login

export const login = createAsyncThunk<User,{ identifier: string; password: string; },{ rejectValue: ErrorPayload }>('auth/login', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, data);
    return response.data.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
})

/// Logout

export const logout = createAsyncThunk<void, void, { rejectValue: ErrorPayload }>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/api/auth/logout`);
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
});

/// Forgot Password

export const forgotPassword = createAsyncThunk<void,{email: string},{ rejectValue: ErrorPayload }>('auth/forgot-password', async (data, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/api/auth/forgot-password`, data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
});

/// Reset Password

export const resetPassword = createAsyncThunk<void,{token: string; password: string},{ rejectValue: ErrorPayload }>('auth/reset-password', async (data, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/api/auth/reset-password/${data.token}`, data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
});


/// check auth

export const checkAuth = createAsyncThunk<User, void, { rejectValue: ErrorPayload }>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/check-auth`);
      return response.data.data as User;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || 'Auth check failed');
    }
  }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const loading = (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    };
    const error = (state: AuthState, action: PayloadAction<ErrorPayload | undefined>) => {
      state.isLoading = false;
      state.error = action.payload ?? 'Something went wrong';
    };
    builder
      .addCase(signup.pending, loading)
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, error)

      .addCase(verifyEmail.pending, loading)
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(verifyEmail.rejected, error)

      .addCase(login.pending, loading)
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, error)

      .addCase(logout.pending, loading)
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, error)

      .addCase(forgotPassword.pending, loading)
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, error)

      .addCase(resetPassword.pending, loading)
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, error)

      .addCase(checkAuth.pending, loading)
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, error)
      
  },
}) 

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

