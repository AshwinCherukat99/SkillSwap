import {Provider,useDispatch} from 'react-redux'
import {store} from './store/store'
import { StrictMode,useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {GoogleOAuthProvider} from '@react-oauth/google'
import { logout,mentorLogout,adminLogout } from './store/slices/authSlice.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.css'
import App from './App.jsx'

function AuthSessionListener({children}){
  const dispatch=useDispatch()
  useEffect(()=>{
    const handleSessionExpired=(event)=>{
      const {role}=event.detail
      if (role==='user'){
        dispatch(logout())
      }else if (role==='mentor'){
        dispatch(mentorLogout())
      }else if (role==='admin'){
        dispatch(adminLogout())
      }
    }
    window.addEventListener(
      'auth:session-expired',
      handleSessionExpired
    )
    return ()=>{
      window.removeEventListener(
        'auth:session-expired',
        handleSessionExpired
      )
    }
  },[dispatch])
  return children
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <AuthSessionListener>
          <App />
        </AuthSessionListener>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
)
