import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store,{persistor} from './store/store.js'
import {NextUIProvider} from '@nextui-org/react'
import { Provider } from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <NextUIProvider>
    <App />
    </NextUIProvider>
    </PersistGate>
    </Provider>
  </React.StrictMode>,
)
