import React,{useEffect,useState} from "react";

const SessionProgress=({
    duration,
    scheduledStart
})=>{
    const [elapsedSeconds,setElapsedSeconds]=useState(0)
    useEffect(()=>{
        if (!scheduledStart||duration==null){
            setElapsedSeconds(0)
            return
        }
        const startTime=new Date(scheduledStart).getTime()
        const totalSeconds=Number(duration)*60
        if (!Number.isFinite(startTime)||
        !Number.isFinite(totalSeconds)||
        totalSeconds<=0){
        return
        }
        const updateProgress=()=>{
            const elapsed=Math.max(
                0,
                Math.floor((Date.now()-startTime)/1000)            
            )
            setElapsedSeconds(Math.min(elapsed,totalSeconds))
        }
        updateProgress()
        const intervalId=window.setInterval(updateProgress,1000)
        return ()=>window.clearInterval(intervalId)
    },[scheduledStart,duration])
    const totalSeconds=Number(duration)*60||0
    const progress=totalSeconds>0?Math.min((elapsedSeconds/totalSeconds)*100,100):0
    const remainingSeconds=Math.max(totalSeconds-elapsedSeconds,0)    
    const minutes=Math.floor(remainingSeconds/60)
    const seconds=remainingSeconds%60
    return (
        <div className="session-progress">

            <div className="session-progress-header">

                <div>
                    <span className="session-label">
                        Session Progress
                    </span>

                    <strong>
                        {minutes}:
                        {String(seconds).padStart(2, "0")}
                    </strong>
                </div>

                <span>
                    {Math.round(progress)}%
                </span>

            </div>

            <div className="progress-bar-container">

                <div
                    className="progress-bar"
                    style={{
                        width: `${progress}%`
                    }}
                ></div>

            </div>

        </div>
    )
}

export default SessionProgress