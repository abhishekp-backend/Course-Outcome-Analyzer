import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import subjectReducer from './slices/subjectSlice';
import studentSlice from './slices/studentSlice';
import poReducer from './slices/poSlice';
import coPoMappingReducer from './slices/coPoMappingSlice';
import userChangesReducer from "./slices/userChanges";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subjects: subjectReducer,
    students: studentSlice,
    pos: poReducer,
    coPoMappings: coPoMappingReducer,
    userChanges: userChangesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginSuccess', 'auth/registerSuccess'],
      },
    })
});

export default store;