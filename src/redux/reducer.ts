// app/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import userReducer from './slice/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
