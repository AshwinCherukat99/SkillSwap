import React,{useEffect,useState} from "react";

const SessionProgress=({
    duration=60
})=>{
    const [elapsedSeconds,setElapsedSeconds]=useState(0)
    useEffect(()=>{
        const interval=setInterval(()=>{
            setElapsedSeconds(prev=>{
                if (prev>=duration*60){
                    return prev
                }
                return prev+1
            })
        },1000)
        return ()=>clearInterval(interval)
    },[duration])
    const totalSeconds=duration*60
    const progress=Math.min((elapsedSeconds/totalSeconds)/100,100)
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