import React,{useEffect,useState} from 'react'

const CountDown=({scheduledStart})=>{
    const calculateRemaining=()=>{
        const target=new Date(scheduledStart).getTime()
        const now=Date.now()
        return Math.max(
            0,
            target-now
        )
    }
    const [remaining,setRemaining]=useState(calculateRemaining())
    useEffect=(()=>{
        const timer=setInterval(()=>{
            setRemaining(calculateRemaining())
        },1000)
        return ()=>clearInterval(timer)
    },[scheduledStart])
    const totalSeconds=Math.floor(
        remaining/1000
    )
    const hours=Math.floor(
        totalSeconds/3600
    )
    const minutes=Math.floor(
        (totalSeconds%3600)/60
    )
    const seconds=totalSeconds%60
    const format=(value)=>{
        String(value).padStart(2,'0')
    }
    if (remaining<=0){
        return (
            <div className="countdown-live">
                <span className="live-dot" />
                Session is starting now
            </div>
        )
    }
    return (
        <div className="countdown-box">

            <span className="small text-muted fw-semibold">
                Starts in
            </span>

            <div className="countdown-values">

                <span>
                    {format(hours)}
                </span>

                <b>:</b>

                <span>
                    {format(minutes)}
                </span>

                <b>:</b>

                <span>
                    {format(seconds)}
                </span>

            </div>

        </div>
    )
}

export default CountDown