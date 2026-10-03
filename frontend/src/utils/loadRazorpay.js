export const loadRazorpay=()=>{
    return new Promise((resolve)=>{
        if (window.razorPay){
            resolve(true)
            return
        }
        const script=document.createElement('script')
        script.src='https://checkout.razorpay.com/v1/checkout.js'
        script.async=true
        script.onload=()=>{
            console.log('razorpay sdk loaded:',window.razorPay)
            resolve(true)
        }
        script.onerror=()=>{
            console.error('failed to load razorpay sdk') 
            resolve(false)
        }
        document.body.appendChild(script)
    })
}