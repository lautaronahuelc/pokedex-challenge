import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'

import '@fontsource/questrial'

import { ToastProvider } from './components/toasts/ToastContext.jsx'
import './styles/global.css'
import App from './App.jsx'
import { store, persistor } from './app/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
