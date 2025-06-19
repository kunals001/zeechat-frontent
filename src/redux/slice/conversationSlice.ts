import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// Types
import type { Message, User, MessageType } from "../type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Interfaces
interface SendMessagePayload {
  userId: string;
  message: string;
  type: MessageType;
}

interface SendMessageResponse {
  message: Message;
}

interface FetchMessagesResponse {
  messages: Message[];
  participants: User[];
}

interface ConversationState {
  messages: Message[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ConversationState = {
  messages: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

// ✅ Fetch Messages
export const fetchMessages = createAsyncThunk<
  FetchMessagesResponse,
  string, // userId
  { rejectValue: string }
>("conversation/fetchMessages", async (userId, { rejectWithValue }) => {
  try {
    const res = await axios.get<FetchMessagesResponse>(`${API_URL}/api/messages/${userId}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Failed to fetch messages");
  }
});

// ✅ Send Message
export const sendMessage = createAsyncThunk<
  Message,
  SendMessagePayload,
  { rejectValue: string }
>("conversation/sendMessage", async ({ userId, message, type }, { rejectWithValue }) => {
  try {
    const res = await axios.post<SendMessageResponse>(
      `${API_URL}/api/messages/send/${userId}`,
      { message, type }
    );
    return res.data.message;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Failed to send message");
  }
});

// ✅ Slice
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    receiveMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    selectUser(state, action: PayloadAction<User>) {
      state.selectedUser = action.payload;
      state.messages = [];
    },
    clearConversation(state) {
      state.messages = [];
      state.selectedUser = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload.messages;
        if (!state.selectedUser) {
          const otherUser = action.payload.participants.find(
            (u) => u._id !== state.selectedUser?._id
          );
          state.selectedUser = otherUser || null;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error loading messages";
      })

      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error sending message";
      });
  },
});

export const { receiveMessage, selectUser, clearConversation } = conversationSlice.actions;
export default conversationSlice.reducer;
