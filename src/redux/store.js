import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user-reducer";
import chatSlice from "./chat-reducer";

const store = configureStore({
  reducer: {
    user: userSlice,
    chat: chatSlice,
  },
});

export default store;
