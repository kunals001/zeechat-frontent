import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

//types
import type{User} from '../type'
type ErrorPayload = string;

axios.defaults.withCredentials = true;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UserState {
    user: User | null;
    isLoading: boolean;
    error : string | null;
}

const initialState: UserState = {
    user: null,
    isLoading: false,
    error: null,
};

// update profile 

export const updateProfile = createAsyncThunk<User, {fullName: string; userName: string; bio: string; profilePic: string;}, { rejectValue: ErrorPayload }>('user/update-profile', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/update-profile`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
})

// follow request

export const sendFollowRequest = createAsyncThunk<User, {userId: string}, { rejectValue: ErrorPayload }>('user/send-follow-request', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/send-follow-request`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
});

// accept follow request

export const acceptFollowRequest = createAsyncThunk<User, {userId: string}, { rejectValue: ErrorPayload }>('user/accept-follow-request', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/accept-follow-request`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
})


// unfollow

export const unfollow = createAsyncThunk<User, {userId: string}, { rejectValue: ErrorPayload }>('user/unfollow', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/unfollow`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
})

// get follow requests

export const getFollowRequests = createAsyncThunk<User, void, { rejectValue: ErrorPayload }>('user/get-follow-requests', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/get-follow-requests`);
    return response.data.followRequests;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
})

// get following users

export const getFollowingUsers = createAsyncThunk<User, void, { rejectValue: ErrorPayload }>('user/get-following-users', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/get-following-users`);
    return response.data.following;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
})

export const getUsers = createAsyncThunk<User, void, { rejectValue: ErrorPayload }>('user/get-users', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/get-users`);
    return response.data.users;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data.error);
    }
  }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      clearError(state) {
      state.error = null;
    },
    },
    extraReducers: (builder) => {
        const loading = (state: UserState) => {
            state.isLoading = true;
            state.error = null;
        };
        const error = (state: UserState, action: PayloadAction<ErrorPayload | undefined>) => {
            state.isLoading = false;
            state.error = action.payload ?? 'Something went wrong';
        };

        builder
        .addCase(sendFollowRequest.pending, loading)
        .addCase(sendFollowRequest.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoading = false;
            state.error = null;
        })
        .addCase(sendFollowRequest.rejected, error)

        .addCase(acceptFollowRequest.pending, loading)
        .addCase(acceptFollowRequest.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoading = false;
            state.error = null;
        })
        .addCase(acceptFollowRequest.rejected, error)

        .addCase(unfollow.pending, loading)
        .addCase(unfollow.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoading = false;
            state.error = null;
        })
        .addCase(unfollow.rejected, error)

        .addCase(getFollowRequests.pending, loading)
        .addCase(getFollowRequests.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
        })
        .addCase(getFollowRequests.rejected, error)

        .addCase(getFollowingUsers.pending, loading)
        .addCase(getFollowingUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
        })
        .addCase(getFollowingUsers.rejected, error)

        .addCase(getUsers.pending, loading)
        .addCase(getUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
        })
        .addCase(getUsers.rejected, error)

        .addCase(updateProfile.pending, loading)
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoading = false;
            state.error = null;
        })
        .addCase(updateProfile.rejected, error)


    }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;

