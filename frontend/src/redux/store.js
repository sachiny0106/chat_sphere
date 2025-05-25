import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import messageReducer from "./messageSlice.js";
import socketReducer from "./socketSlice.js";
import themeReducer from "./themeSlice.js";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
  import storage from 'redux-persist/lib/storage'

  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['user', 'message'], // theme is handled by themeSlice's localStorage
  }

  const rootReducer = combineReducers({
    user:userReducer,
    message:messageReducer,
    socket:socketReducer,
    theme: themeReducer,
 })

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'theme/setTheme', 'socket/setSocket'],
        ignoredPaths: ['socket.socket', 'theme.currentTheme'], // socket object is not serializable
      },
    }),
});
export default store;