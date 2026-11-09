export async function enablePushNotifications(){
    if (!('serviceWorker' in navigator)||!('PushManager' in window)){
        throw new Error('push notifications are not supported')
    }
    const permission=await Notification.requestPermission()
    if (permission!=='granted'){
        throw new Error('notification permission not granted')
    }
    const registration=await navigator.serviceWorker.register(
        '/service-worker.js'
    )
    const subscription=await registration.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:urlBase64ToUint8Array(
            import.meta.env.production.VITE_VAPID_PUBLIC_KEY
        )
    })  
    return subscription.toJSON()
}