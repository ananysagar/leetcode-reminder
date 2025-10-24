import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import leetcodeReducer from "./slices/leetcodeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leetcode: leetcodeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
