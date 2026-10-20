/**
 * Redux store configuration with RTK Query
 * and redux-persist.
 * @module store/store
 */
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import uiReducer from './slices/uiSlice';
import plannerReducer from './slices/plannerSlice';
import gamificationReducer from './slices/gamificationSlice';
import startupTypeReducer
  from './slices/startupTypeSlice';
import businessReducer from './slices/businessSlice';
import guideReducer from './slices/guideSlice';
import { persistConfig } from './persistConfig';

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  ui: uiReducer,
  planner: plannerReducer,
  gamification: gamificationReducer,
  startupType: startupTypeReducer,
  business: businessReducer,
  guide: guideReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

/** Shape of the combined root reducer. */
export type RootReducerState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Creates a new Redux store + persistor pair.
 * Used by StoreProvider for lazy initialization.
 */
export function makeStore() {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware),
  });
  const persistor = persistStore(store);
  return { store, persistor };
}

/** Type of the store returned by makeStore. */
export type AppStore = ReturnType<typeof makeStore>['store'];

/** Inferred root state type. */
export type RootState = ReturnType<AppStore['getState']>;

/** Inferred dispatch type. */
export type AppDispatch = AppStore['dispatch'];
