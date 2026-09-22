import React,{useEffect,useState} from 'react'        

import {Clock3,Video} from 'lucide-react'

const CountDownSession=({scheduledStart,onReady})=>{
    const calculateRemaining=()=>{
        const difference=new Date(scheduledStart).getTime()-Date.now()
        return Math.max(
            0,
            difference
        )
    }
    const [remaining,setRemaining]=useState(calculateRemaining())
    useEffect(()=>{
        const timer=setInterval(()=>{
            const value=calculateRemaining()
            setRemaining(value)
            if (value===0 && onReady){
                onReady()
            }
        },1000)
        return ()=>clearInterval(timer)
    },[scheduledStart])
    const totalSeconds=Math.floor(remaining/1000)
    const hours=Math.floor(totalSeconds/3600)
    const minutes=Math.floor((totalSeconds%3600)/60)
    const seconds=totalSeconds%60 
    const format=(value)=>String(value).padStart(2,'0')
    const isReady=remaining===0
    return (
        <div className="countdown-session">

            <div className="countdown-value">

                <Clock3 size={21} />

                {isReady
                    ? 'Session is starting now'
                    : `${format(hours)}:${format(minutes)}:${format(seconds)}`
                }

            </div>


            <button
                className="btn btn-success join-session-button"
                disabled={!isReady}
            >

                <Video size={18} />

                Join Session

            </button>

        </div>
    )
}

export default CountDownSession