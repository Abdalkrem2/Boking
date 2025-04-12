import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "./src/slice/basketSlice";
import languageSlice from "./src/slice/langSlice";
import apiSlice from "./src/slice/apiSlice";
export const store = configureStore({
  reducer: {
    apiData: apiSlice,
    basket: basketReducer,
    language: languageSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
