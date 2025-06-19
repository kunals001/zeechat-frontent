// app/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import conversationReducer from './slice/conversationSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  conversation: conversationReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
