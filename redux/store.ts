import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";

export const store = configureStore({
  reducer: {
    product: productReducer, // Changed from productSlice to productReducer
  },
});

// Corrected type names (RootState instead of Rootstate)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
