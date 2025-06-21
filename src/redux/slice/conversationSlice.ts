import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { Message, User, MessageType } from "../type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// -------------------- Interfaces --------------------
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
  typingUserIds: string[]; // userIds typing
  onlineUsers: Record<string, boolean>;
  lastSeenMap: Record<string, string>;
}

// -------------------- Initial State --------------------
const initialState: ConversationState = {
  messages: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  typingUserIds: [],
  onlineUsers: {},
  lastSeenMap: {},
};

// -------------------- Async Thunks --------------------
export const fetchMessages = createAsyncThunk<
  FetchMessagesResponse,
  string,
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

// -------------------- Slice --------------------
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    receiveMessage(state, action: PayloadAction<Message>) {
      const exists = state.messages.some((msg) => msg._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
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

    setTyping(state, action: PayloadAction<{ userId: string; isTyping: boolean }>) {
  const { userId, isTyping } = action.payload;

  // ✅ Fallback to array if undefined for safety
  if (!Array.isArray(state.typingUserIds)) {
    state.typingUserIds = [];
  }

  if (isTyping) {
    if (!state.typingUserIds.includes(userId)) {
      state.typingUserIds.push(userId);
    }
  } else {
    state.typingUserIds = state.typingUserIds.filter((id) => id !== userId);
  }
},

    updateOnlineStatus(state, action: PayloadAction<{ userId: string; isOnline: boolean }>) {
      state.onlineUsers[action.payload.userId] = action.payload.isOnline;
    },

    updateLastSeen(state, action: PayloadAction<{ userId: string; lastSeen: string }>) {
      state.lastSeenMap[action.payload.userId] = action.payload.lastSeen;
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

        // Replace any temp message with same _id (if used in frontend)
        state.messages = state.messages.filter((msg) => msg._id !== action.payload._id);

        // Add confirmed message
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error sending message";
      });
  },
});

// -------------------- Export --------------------
export const {
  receiveMessage,
  selectUser,
  clearConversation,
  setTyping,
  updateOnlineStatus,
  updateLastSeen,
} = conversationSlice.actions;

export default conversationSlice.reducer;
