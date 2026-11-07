import { useCallback,useEffect,useState,useRef } from "react";

import useWhiteBoardSocket from "../../hooks/useWhiteboardSocket";
import WhiteboardCanvas from "./WhiteboardCanvas";
import WhiteboardToolbar from "./WhiteboardToolbar";
import './Whiteboard.css'

const Whiteboard=({
    conversationId,
    accessToken,
    isMentor,
    isOpen,
    onVisibilityChange,
    localVideoRef,
    remoteVideoRef,
    onClose,
})=>{
    const localThumbnailRef=useRef(null)
    const remoteThumbnailRef=useRef(null)
    const openSentRef=useRef(false)
    const [strokes,setStrokes]=useState([])
    const [redoStack,setRedoStack]=useState([])
    const [tool,setTool]=useState('pen')
    const [color,setColor]=useState('#111827')
    const [brushSize,setBrushSize]=useState(4)
    const handleWhiteboardMessage=useCallback((message)=>{
        if (message.type==='whiteboard_open'){
            if (!isMentor){
                onVisibilityChange?.(true)
            }
            return
        }
        if (message.type==='whiteboard_close'){
            if (!isMentor){
                onVisibilityChange?.(false)
            }
            return
        }
        if (message.type==='draw'){
            if (!message.payload?.stroke) return 
            setStrokes((previous)=>[
                ...previous,
                message.payload.stroke
            ])
            setRedoStack([])
        }
        if (message.type==='undo'){
            setStrokes((previous)=>{
                if (!previous.length) return previous
                const removedStroke=previous[previous.length-1]
                setRedoStack((redoPrevious)=>[
                    ...redoPrevious,
                    removedStroke
                ])
                return previous.slice(0,-1)
            })
        }
        if (message.type==='redo'){
            const stroke=message.payload?.stroke
            if (!stroke) return 
            setStrokes((previous)=>[
                ...previous,
                stroke,
            ])
            setRedoStack((previous)=>previous.slice(0,-1))
        }
        if (message.type==='clear'){
            setStrokes([])
            setRedoStack([])
        }
    },[strokes])
    const {
        connected,
        error,
        sendEvent
    }=useWhiteBoardSocket(
        conversationId,
        accessToken,
        handleWhiteboardMessage
    )
    useEffect(()=>{
        if (!isMentor) return
        if (isOpen&&connected&&!openSentRef.current){
            const sent=sendEvent('whiteboard_open')
            if (sent){
                openSentRef.current=true
            }
        }
        if (!isOpen){
            openSentRef.current=false
        }
    },[isMentor,isOpen,connected,sendEvent])
    useEffect(()=>{
        const attachThumbnails=()=>{
            const localStream=localVideoRef?.current?.srcObject
            const remoteStream=remoteVideoRef?.current?.srcObject
            const localVideo=localThumbnailRef.current
            const remoteVideo=remoteThumbnailRef.current
            if (localVideo&&localStream){
                if (localVideo.srcObject!==localStream){
                    localVideo.srcObject=localStream
                    localVideo.play().catch(()=>{})
                }
            }
            if (remoteVideo&&remoteStream){
                if (remoteVideo.srcObject!==remoteStream){
                    remoteVideo.srcObject=remoteStream
                    remoteVideo.play().catch(()=>{})
                }
            }
        }
        attachThumbnails()
            const intervalId=window.setInterval(
                attachThumbnails,
                500
            )
            return ()=>{
                window.clearInterval(intervalId)
                if (localThumbnailRef.current){
                    localThumbnailRef.current.srcObject=null
                }
                if (remoteThumbnailRef.current){
                    remoteThumbnailRef.current.srcObject=null
                }
            }
    },[localVideoRef,remoteVideoRef])
    const handleStrokeComplete=(stroke)=>{
        if (!isMentor) return
        setStrokes((previous)=>[
            ...previous,
            stroke
        ])
        setRedoStack([])
        sendEvent('draw',{
            stroke,
        })
    }
    const handleUndo=()=>{
        if (!isMentor||!strokes.length) return
        const lastStroke=strokes[strokes.length-1]
        setStrokes((previous)=>previous.slice(0,-1))
        setRedoStack((previous)=>[
            ...previous,
            lastStroke
        ])
        sendEvent('undo')
    }
    const handleRedo=()=>{
        if (!isMentor||!redoStack.length) return
        const stroke=redoStack[redoStack.length-1]       
        setStrokes((previous)=>[
            ...previous,
            stroke,
        ])
        setRedoStack((previous)=>previous.slice(0,-1))
        sendEvent('redo',{
            stroke,
        })
    }
    const handleClear=()=>{
        if (!isMentor) return
        setStrokes([])
        setRedoStack([])
        sendEvent('clear')
    }
    const handleClose=()=>{
        if (isMentor&&connected){
            sendEvent('whiteboard_close')
        }
        onClose?.()
    }
    if (!isOpen){
        return null
    }
    return (
        <div className="whiteboard-overlay">

            <header className="whiteboard-header">
                <div className="whiteboard-header-title">
                    <div className="whiteboard-logo">
                        <i className="fas fa-chalkboard" />
                    </div>

                    <div>
                        <h2>Session Whiteboard</h2>
                        <span>
                            {isMentor
                                ? "You are presenting"
                                : "Viewing mentor's whiteboard"}
                        </span>
                    </div>
                </div>

                <div className="whiteboard-header-actions">
                    <div className={`whiteboard-connection ${connected ? "connected" : "disconnected"}`}>
                        <span />
                        {connected ? "Connected" : error||"Connecting..."}
                    </div>

                    <button
                        type="button"
                        className="whiteboard-close-button"
                        onClick={handleClose}
                    >
                        <i className="fas fa-compress" />
                        <span>Return to call</span>
                    </button>
                </div>
            </header>

            {isMentor && (
                <WhiteboardToolbar
                    tool={tool}
                    setTool={setTool}
                    color={color}
                    setColor={setColor}
                    brushSize={brushSize}
                    setBrushSize={setBrushSize}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onClear={handleClear}
                    canUndo={strokes.length > 0}
                    canRedo={redoStack.length > 0}
                />
            )}

            {!isMentor && (
                <div className="whiteboard-viewer-notice">
                    <i className="fas fa-eye" />
                    You are viewing the mentor's whiteboard.
                </div>
            )}

            {error && (
                <div className="whiteboard-error">
                    {error}
                </div>
            )}

            <div className="whiteboard-workspace">

                <div className="whiteboard-canvas-container">
                    <WhiteboardCanvas
                        strokes={strokes}
                        tool={tool}
                        color={color}
                        brushSize={brushSize}
                        canDraw={isMentor}
                        onStrokeComplete={handleStrokeComplete}
                    />
                </div>

                <div className="whiteboard-video-thumbnails">

                    <div className="whiteboard-video-card">
                        <video
                            ref={localThumbnailRef}
                            autoPlay
                            muted
                            playsInline
                        />
                        <span>You</span>
                    </div>

                    <div className="whiteboard-video-card">
                        <video
                            ref={remoteThumbnailRef}
                            autoPlay
                            playsInline
                        />
                        <span>
                            {isMentor ? "Student" : "Mentor"}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Whiteboard