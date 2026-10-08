import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/auth.slice";
import propertyReducer from "../features/properties/property.slice";
import favoritesReducer from "../features/favorites/favorites.slice";
import bookingReducer from "../features/bookings/booking.slice";
import messageReducer from "../features/messages/message.slice";
import profileReducer from "../features/profile/profile.slice";
import searchReducer from "../features/search/search.slice";
import assistantReducer from "../features/assistant/assistant.slice";
import predictionReducer from "../features/pricePrediction/prediction.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    favorites: favoritesReducer,
    bookings: bookingReducer,
    messages: messageReducer,
    profile: profileReducer,
    search: searchReducer,
    assistant: assistantReducer,
    prediction: predictionReducer,
  },

  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
