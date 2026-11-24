function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0))
  );
}
export async function enablePushNotifications(apiClient,endpoint){
    if (!('serviceWorker' in navigator)||!('PushManager' in window)){
        throw new Error('push notifications are not supported')
    }
    const vapidPublicKey=import.meta.env.VITE_VAPID_PUBLIC_KEY
    if (!vapidPublicKey){
        throw new Error('VAPID public key is not configured')
    }
    const permission=await Notification.requestPermission()
    if (permission!=='granted'){
        throw new Error('notification permission not granted')
    }
    const registration=await navigator.serviceWorker.register(
        '/service-worker.js'
    )
    await navigator.serviceWorker.ready
    let subscription=await register.pushManager.getSubscription()
    if (!subscription){
         const subscription=await registration.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:urlBase64ToUint8Array(
            vapidPublicKey
        )
    }) 
    } 
    const subscriptionData=subscription.toJSON()
    await apiClient.post(
        endpoint,
        subscriptionData
    )  
    return subscriptionData
}
export async function disablePushNotifications(apiClient,endpoint){
    if (!('serviceWorker' in navigator)){
        throw new Error(
            'service workers are not supported'
        )
    }
    const registration=await navigator.serviceWorker.register(
        '/service-worker.js'
    ) 
    if (!registration){
        return false
    }
    let subscription=await navigator.pushManager.getSubscription()
    if (!subscription){
        return False
    }
    const subscriptionData=subscription.toJSON()
    await apiClient.delete(endpoint,{
        data:{
            endpoint:subscriptionData.endpoint
        }
    })
    await subscription.unsubscribe()
    return true
}