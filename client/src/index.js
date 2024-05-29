import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { default as authReducer } from 'state';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';

// Configures how the Redux state is persisted
const persistConfig = { key: 'root', storage, version: 1 };

// Wraps the authReducer with persistence capabilities using the specified configuration
const persistedReducer = persistReducer(persistConfig, authReducer);

// Creates the Redux store, configures persistence and customizes middleware for serialization checks
const store = configureStore({
  reducer: persistedReducer, // Set persistance
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
