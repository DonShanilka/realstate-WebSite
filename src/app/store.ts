import { configureStore } from "@reduxjs/toolkit";
import auth from "../features/auth/auth.slice";
import properties from "../features/properties/property.slice";
import search from "../features/search/search.slice";
import favorites from "../features/favorites/favorites.slice";
import bookings from "../features/bookings/booking.slice";
import messages from "../features/messages/message.slice";
import profile from "../features/profile/profile.slice";
import assistant from "../features/assistant/assistant.slice";
import prediction from "../features/pricePrediction/prediction.slice";

export const store = configureStore({
  reducer: {
    auth,
    properties,
    search,
    favorites,
    bookings,
    messages,
    profile,
    assistant,
    prediction,
  },
  devTools: import.meta.env.DEV,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
