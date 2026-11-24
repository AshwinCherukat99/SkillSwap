import { useEffect,useState } from "react";
import { enablePushNotifications,disablePushNotifications } from "../utils/enablePushNotifications";

function PushNotificationSettings({apiClient,endpoint}){
    const [enabled,setEnabled]=useState(false)
    const [loading,setLoading]=useState(true)
    const [processing,setProcessing]=useState(false)
    const [message,setMessage]=useState('')
    const [error,setError]=useState('')
    useEffect(()=>{
        const checkSubscription=async ()=>{
            try{
                if (!('serviceWorker' in navigator)){
                    setError('your browser does not support push notifications')
                    return
                }
                const registration=navigator.serviceWorker.getRegistration(
                    '/service-worker.js'
                )
                if (registration){
                    subscription=await registration.pushManager.getSubscription()
                    setEnabled(Boolean(subscription))
                }
            }catch(err){
                console.error('unable to check push subscription:',err)
            }finally{
                setLoading(false)
            }
        }
        checkSubscription()
    },[])
    const handleEnable=async ()=>{
        try{
            setProcessing(true)
            setError('')
            setMessage('')
            await enablePushNotifications(apiClient,endpoint)
            setEnabled(true)
            setMessage('browser push notifications enabled successfully')
        }catch(err){
            console.error('push notification registration failed:',err)
            setError(
                err.response?.data?.detail||
                err.message||
                'unable to enable push notifications'
            )
        }finally{
            setProcessing(false)
        }
    }
    const handleDisable=async ()=>{
        try{
            setProcessing(true)
            setError('')
            setMessage('')
            await disablePushNotifications(apiClient,endpoint)
            setEnabled(false)
            setMessage('browser push notifications disabled')
        }catch(err){
            console.error('browser push notification disabling failed:',err)
            setError(err.response?.data?.detail||
                err.message||
                'unable to disable push notifications'
            )
        }finally{
            setProcessing(false)
        }
    }
    return (
        <div className="card surface-card shadow-sm border-0 p-4 mt-4">
      <div className="d-flex align-items-start gap-3">
        <div className="rounded-circle bg-primary-subtle text-primary p-3">
          <span className="material-symbols-outlined">
            notifications_active
          </span>
        </div>

        <div className="flex-grow-1">
          <h5 className="section-title mb-1">Push Notifications</h5>

          <p className="text-muted small mb-3">
            Receive notifications from SkillSwap even when the website
            is not currently open.
          </p>

          {loading ? (
            <span className="text-muted small">
              Checking notification status...
            </span>
          ) : (
            <>
              <div className="mb-3">
                <span
                  className={`badge ${
                    enabled ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {enabled ? "Enabled" : "Disabled"}
                </span>
              </div>

              {enabled ? (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleDisable}
                  disabled={processing}
                >
                  {processing ? "Please wait..." : "Disable Notifications"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleEnable}
                  disabled={processing}
                >
                  {processing ? "Please wait..." : "Enable Notifications"}
                </button>
              )}
            </>
          )}

          {message && (
            <div className="alert alert-success py-2 mt-3 mb-0 small">
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-danger py-2 mt-3 mb-0 small">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
    )
}

export default PushNotificationSettings