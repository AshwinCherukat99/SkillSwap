import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Clock3, Video } from 'lucide-react'


const CountDownSession = ({
    scheduledStart,
    durationMinutes,
    roomName,
    conversationId,
    onExpired,
}) => {

    const navigate = useNavigate()


    const calculateState = () => {

        const start =
            new Date(scheduledStart).getTime()

        const end =
            start +
            Number(durationMinutes) * 60 * 1000

        const now = Date.now()


        // Before session
        if (now < start) {

            return {
                state: 'UPCOMING',
                remaining: start - now,
            }

        }


        // Session currently running
        if (now >= start && now < end) {

            return {
                state: 'LIVE',
                remaining: end - now,
            }

        }


        // Session has ended
        return {
            state: 'EXPIRED',
            remaining: 0,
        }

    }


    const [sessionState, setSessionState] = useState(
        calculateState()
    )


    useEffect(() => {

        // Check immediately
        const initialState = calculateState()

        setSessionState(initialState)


        if (initialState.state === 'EXPIRED') {

            onExpired?.()

            return

        }


        const timer = setInterval(() => {

            const newState = calculateState()

            setSessionState(newState)


            if (newState.state === 'EXPIRED') {

                clearInterval(timer)

                onExpired?.()

            }

        }, 1000)


        return () => {
            clearInterval(timer)
        }

    }, [
        scheduledStart,
        durationMinutes,
        onExpired,
    ])


    const totalSeconds = Math.floor(
        sessionState.remaining / 1000
    )


    const hours = Math.floor(
        totalSeconds / 3600
    )


    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    )


    const seconds = totalSeconds % 60


    const format = (value) =>
        String(value).padStart(2, '0')


    
const handleJoinSession = () => {
    console.log('Join Session clicked');
    console.log('Session state:', sessionState.state);
    console.log('Room name:', roomName);
    console.log('Conversation ID:', conversationId);

    if (sessionState.state !== 'LIVE') {
        console.error('Session is not live yet');
        return;
    }

    if (!roomName || !conversationId) {
        console.error('Missing roomName or conversationId');
        return;
    }

    const target = `/video-call/${roomName}/${conversationId}`;
    console.log('Navigating to:', target);

    navigate(target);
};



    // Don't render the countdown after expiration
    if (sessionState.state === 'EXPIRED') {
        return null
    }


    return (

        <div className="countdown-session">

            <div className="countdown-value">

                <Clock3 size={21} />


                {sessionState.state === 'UPCOMING' && (

                    <>
                        Starts in{' '}

                        {format(hours)}:
                        {format(minutes)}:
                        {format(seconds)}
                    </>

                )}


                {sessionState.state === 'LIVE' && (

                    <>
                        Session is live
                    </>

                )}

            </div>


            <button
                className="btn btn-success join-session-button"
                disabled={
                    sessionState.state !== 'LIVE'
                }
                onClick={handleJoinSession}
            >

                <Video size={18} />

                Join Session

            </button>

        </div>

    )

}


export default CountDownSession