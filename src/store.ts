import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './store/slices/todoSlice';
import { api } from './store/api';
import authReducer from './store/slices/authSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
