import React,{useEffect,useState,useRef} from "react";

const AssessmentTimer=({deadline,onTimeUp,disabled=false})=>{
    const onTimeUpRef=useRef(onTimeUp)
    const expiredRef=useRef(false)
    useEffect(()=>{
        onTimeUpRef.current=onTimeUp
    },[onTimeUp])
    const getRemainingTime=()=>{
        if (!deadline) return 0
        return Math.max(
            0,
            new Date(deadline).getTime()-Date.now()
        )
    }
    const [remaining,setRemaining]=useState(getRemainingTime)
    useEffect(()=>{
        expiredRef.current=false
        const updateTimer=()=>{
            const timeLeft=getRemainingTime()
            setRemaining(timeLeft)
            if (timeLeft<=0 && !expiredRef.current){
                expiredRef.current=true
                onTimeUpRef.current?.()
            }
        }
        updateTimer()
        const interval=setInterval(updateTimer,1000)
        return ()=>clearInterval(interval)
    },[deadline])
    const totalSeconds=Math.ceil(remaining/1000)
    const minutes=Math.floor(totalSeconds/60)
    const seconds=totalSeconds%60
    const isCritical=totalSeconds<=60
    const isWarning=totalSeconds<=300
    return (
        <div
            className={`assessment-timer ${
                isCritical
                    ? "timer-critical"
                    : isWarning
                    ? "timer-warning"
                    : ""
            }`}
            role="timer"
            aria-label={`Time remaining ${minutes} minutes ${seconds} seconds`}
        >
            <div className="timer-icon">
                <i className="bi bi-clock-history" />
            </div>

            <div className="timer-info">
                <span className="timer-label">
                    Time Remaining
                </span>

                <strong className="timer-value">
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                </strong>
            </div>

            {isWarning && (
                <span className="timer-warning-text">
                    {isCritical
                        ? "Hurry up!"
                        : "5 minutes or less"}
                </span>
            )}
        </div>
    )
}

export default AssessmentTimer