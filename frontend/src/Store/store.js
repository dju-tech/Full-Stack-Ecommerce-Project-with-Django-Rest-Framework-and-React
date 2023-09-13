import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './cartSlice'
import messageSlice from './messageSlice'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';


const rootPersistConfig = {
    key : 'root',
    storage,
    blacklist : ['message']
}

const rootReducer = combineReducers({
    cart: cartSlice.reducer,
    message: messageSlice.reducer
})


const persistedReducer = persistReducer(rootPersistConfig, rootReducer)


export const store = configureStore({
    reducer : persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})

export const persistor = persistStore(store)