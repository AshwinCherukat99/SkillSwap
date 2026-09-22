import {Provider} from 'react-redux'
import {store} from './store/store'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {GoogleOAuthProvider} from '@react-oauth/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
)
