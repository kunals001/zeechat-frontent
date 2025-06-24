import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { Message, User, MessageType } from "../type";
import { RootState } from '../reducer';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

// -------------------- Interfaces --------------------
interface SendMessagePayload {
  userId: string;
  message: string;
  type: MessageType;
  mediaUrl?: string;
  caption?: string;
  replyTo?: string;
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
>(
  "conversation/sendMessage",
  async ({ userId, message, type, caption, mediaUrl, replyTo }, { rejectWithValue }) => {
    try {
      const res = await axios.post<SendMessageResponse>(
        `${API_URL}/api/messages/send/${userId}`,
        { message, type, caption, mediaUrl, replyTo } // ✅ Add replyTo here
      );
      return res.data.message;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to send message");
    }
  }
);




export const addReactionToMessageAsync = createAsyncThunk<
  { messageId: string; emoji: string; userId: string },
  { messageId: string; emoji: string },
  { state: RootState; rejectValue: string }
>(
  "conversation/addReactionToMessage",
  async ({ messageId, emoji }, { rejectWithValue, getState }) => {
    try {
      await axios.post(`${API_URL}/api/messages/react`, { messageId, emoji });

      const user = getState().auth.user;
      if (!user) {
        return rejectWithValue("User not authenticated");
      }

      return { messageId, emoji, userId: user._id };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to react");
    }
  }
);



// ---------------- Delete Message ----------------
export const deleteMessageAsync = createAsyncThunk<
  { messageId: string; type: "for_me" | "for_everyone"; userId: string },
  { messageId: string; type: "for_me" | "for_everyone" },
  { rejectValue: string }
>("conversation/deleteMessage", async ({ messageId, type }, { rejectWithValue, getState }) => {
  try {
    const userId = (getState() as RootState).auth.user?._id!;
    await axios.delete(`${API_URL}/api/messages/message/${messageId}?type=${type}`);
    return { messageId, type, userId };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Failed to delete message");
  }
});



/// -------------- Clear Chat For Me ----------------
export const clearChatForMeAsync = createAsyncThunk<
  string, 
  string,
  { rejectValue: string }
>("conversation/clearChatForMe", async (selectedUserId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/api/messages/clear/${selectedUserId}`);
    return selectedUserId;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Failed to clear chat");
  }
});



// -------------------- Slice --------------------
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {

    seenMessage: (
       state,
       action: PayloadAction<{ messageId: string; userId: string }>
     ) => {
       const { messageId, userId } = action.payload;
       const msg = state.messages.find((m) => m._id === messageId);
       if (!msg) return;

       // ✅ Use Set for safety against duplicates
       const seenSet = new Set(msg.seenBy ?? []);
       seenSet.add(userId);
       msg.seenBy = Array.from(seenSet);
     },
    
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
      },        addReactionToMessage(
      state,
      action: PayloadAction<{ messageId: string; emoji: string; userId: string }>
    ) {
      const { messageId, emoji, userId } = action.payload;
      const msg = state.messages.find((m) => m._id === messageId);

      if (msg) {
        if (!msg.reactions) msg.reactions = [];
        const existing = msg.reactions.find((r) => r.userId === userId);
    
        if (existing?.emoji === emoji) {
          // same emoji → remove
          msg.reactions = msg.reactions.filter((r) => r.userId !== userId);
        } else {
          msg.reactions = msg.reactions.filter((r) => r.userId !== userId);
          msg.reactions.push({ emoji, userId });
        }
      }
    },

    updateOnlineStatus(state, action: PayloadAction<{ userId: string; isOnline: boolean }>) {
      state.onlineUsers[action.payload.userId] = action.payload.isOnline;
    },

    updateLastSeen(state, action: PayloadAction<{ userId: string; lastSeen: string }>) {
      state.lastSeenMap[action.payload.userId] = action.payload.lastSeen;
    },

    messageDeleted: (      
      state,
      action: PayloadAction<{ messageId: string; deleteType: "me" | "everyone";     userId: string }>
    ) => {
      const { messageId, deleteType, userId } = action.payload;
      const msg = state.messages.find((m) => m._id === messageId);
      if (!msg) return;

      if (deleteType === "me") {
        if (!msg.deletedFor) msg.deletedFor = [];
        if (!msg.deletedFor.includes(userId)) {
          msg.deletedFor.push(userId);
        }
      } else if (deleteType === "everyone") {
        if (!msg.deletedFor) msg.deletedFor = [];
        // 👇 Add receiver only (not sender)
        msg.deletedFor.push(userId); // userId = receiver here
        msg.isDeleted = true;    
      }
    },

    clearChatForMe: (state, action: PayloadAction<{ userId: string }>) => {
    state.messages = state.messages.filter(
    (msg) =>
      msg.sender._id !== action.payload.userId &&
      msg.receiver?._id !== action.payload.userId
      );
    },

    clearSelectedUser: (state) => {
      state.selectedUser = null;    
    },
    messageSeen: (
      state,
      action: PayloadAction<{ messageId: string; seenBy: string }>
    ) => {
      const { messageId, seenBy } = action.payload;
      const msg = state.messages.find((m) => m._id === messageId);
      if (msg) {
        if (!Array.isArray(msg.seenBy)) {
          msg.seenBy = [];
        }
        if (!msg.seenBy.includes(seenBy)) {
          msg.seenBy.push(seenBy);
        }
      }
    }

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
      })
      .addCase(addReactionToMessageAsync.fulfilled, (state, action) => {
      const { messageId, emoji, userId } = action.payload;
      const msg = state.messages.find((m) => m._id === messageId);
      if (!msg) return;

      const existingReaction = msg.reactions?.find(
        (r) => r.userId === userId
      );

      if (!msg.reactions) {
        msg.reactions = [];
      }

      // If user clicked the same emoji again -> remove it
      if (existingReaction?.emoji === emoji) {
        msg.reactions = msg.reactions.filter((r) => r.userId !== userId);
      } else {
        // Remove any existing reaction by user
        msg.reactions = msg.reactions.filter((r) => r.userId !== userId);
        // Add new reaction
        msg.reactions.push({ emoji, userId });
      }
      })
      .addCase(deleteMessageAsync.fulfilled, (state, action) => {
        const { messageId, type, userId } = action.payload;

        if (type === "for_everyone") {
          state.messages = state.messages.filter((m) => m._id !== messageId);
        }

        if (type === "for_me") {
          const msg = state.messages.find((m) => m._id === messageId);
          if (msg) {
            if (!msg.deletedFor) msg.deletedFor = [];
            if (!msg.deletedFor.includes(userId)) {
              msg.deletedFor.push(userId);
            }
          }
        }
      })
      .addCase(clearChatForMeAsync.fulfilled, (state, action) => {
        const currentUserId = action.meta.arg; // selectedUserId passed earlier
        state.messages = state.messages.filter((msg) => {
          if (!msg.deletedFor) return true;
          return !msg.deletedFor.includes(currentUserId);
        });
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
  addReactionToMessage,
  messageDeleted,
  clearChatForMe,
  clearSelectedUser,
  messageSeen
} = conversationSlice.actions;

export default conversationSlice.reducer;
