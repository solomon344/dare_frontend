import { configureStore,combineReducers } from "@reduxjs/toolkit";
import MessageSlice from "../states/messageSlice/MessageSlice";
import UserSlice from "../states/userSlice/UserSlice";
import storage from 'redux-persist/lib/storage'
import { persistReducer,persistStore,FLUSH,REGISTER,REHYDRATE,PAUSE,PERSIST,PURGE } from 'redux-persist'


const persistConfig = {
    key:'root',
    storage
}

const reducers = combineReducers({
    message:MessageSlice,
    user:UserSlice
})

const persistedReducer = persistReducer(persistConfig,reducers)

const store = configureStore({
reducer:persistedReducer,
middleware:(getDefaultMiddleware)=>{
    return (
        getDefaultMiddleware({
            serializableCheck:false,
        })
    )
}
})

export default store
export const persistor = persistStore(store)