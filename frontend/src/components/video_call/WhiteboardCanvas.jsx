import { useEffect,useRef,useState } from "react";

const WhiteboardCanvas=({
    strokes,
    tool,
    color,
    brushSize,
    canDraw,
    onStrokeComplete,
})=>{
    const canvasRef=useRef(null)
    const draftRef=useRef(null)
    const [draft,setDraft]=useState(null)
    const drawStroke=(ctx,stroke,width,height)=>{
        if (!stroke?.points?.length){
            return
        }
        ctx.save()
        ctx.lineWidth=stroke.size
        ctx.lineCap='round'
        ctx.lineJoin='round'
        if (stroke.tool=='eraser'){
            ctx.globalCompositeOperation='destination-out' 
            ctx.strokeStyle='rgba(0,0,0,1)'
        }else{
            ctx.globalCompositeOperation='source-over'
            ctx.strokeStyle=stroke.color
        }
        const points=stroke.points
        ctx.beginPath()
        const firstPoint=points[0]
        ctx.moveTo(
            firstPoint.x*width,
            firstPoint.y*height
        )
        if (points.length===1){
            ctx.arc(
                firstPoint.x*width,
                firstPoint.y*height,
                stroke.size/2,
                0,
                Math.PI*2
            )
            ctx.fillStyle=stroke.tool==='eraser'?"#FFFFFF":stroke.color
            ctx.fill()
        }else{
            points.forEach((point)=>{
                ctx.lineTo(
                    point.x*width,
                    point.y*height,
                )
            })
            ctx.stroke()
        }
        ctx.restore()
    }
    useEffect(()=>{
        const canvas=canvasRef.current
        if (!canvas) return
        const resizeCanvas=()=>{
            const rect=canvas.getBoundingClientRect()
            const dpr=window.devicePixelRatio||1
            canvas.width=Math.round(rect.width*dpr)
            canvas.height=Math.round(rect.height*dpr)
            const ctx=canvas.getContext('2d')
            ctx.setTransform(dpr,0,0,dpr,0,0)
            ctx.fillStyle='#FFFFFF'
            ctx.fillRect(0,0,rect.width,rect.height)
            strokes.forEach((stroke)=>{
                drawStroke(ctx,stroke,rect.width,rect.height)
            })
            if (draftRef.current){
                drawStroke(ctx,draftRef.current,rect.width,rect.height)
            }
        }
        resizeCanvas()
        const observer=new ResizeObserver(resizeCanvas)
        observer.observe(canvas)
        return ()=>observer.disconnect()
    },[strokes,draft])
    const getPoint=(event)=>{
        const canvas=canvasRef.current
        const rect=canvas.getBoundingClientRect()
        return {
            x:Math.max(
                0,
                Math.min(1,(event.clientX-rect.left)/rect.width)
            ),
            y:Math.max(
                0,
                Math.min(1,(event.clientY-rect.top)/rect.height)
            )
        }
    }
    const handlePointerDown=(event)=>{
        if (!canDraw) return
        event.preventDefault()
        const canvas=canvasRef.current
        canvas.setPointerCapture(event.pointerId)
        const newStroke={
            id:crypto.randomUUID(),
            tool,
            color,
            size:brushSize,
            points:[getPoint(event)],
        }
        draftRef.current=newStroke
        setDraft(newStroke)
    }
    const handlePointerMove=(event)=>{
        if (!canDraw||!draftRef.current) return  
        event.preventDefault()
        const updatedStroke={
            ...draftRef.current,
            points:[
                ...draftRef.current.points,
                getPoint(event),
            ],
        }
        draftRef.current=updatedStroke
        setDraft(updatedStroke)
    }
    const handlePointerUp=(event)=>{
        if (!canDraw||!draftRef.current) return
        event.preventDefault()
        const completedStroke=draftRef.current
        draftRef.current=null
        setDraft(null)
        onStrokeComplete(completedStroke)
    }
    const handlePointerCancel=()=>{
        draftRef.current=null
        setDraft(null)
    }
    return (
        <canvas
        ref={canvasRef}
        className={`whiteboard-canvas ${canDraw?'drawing-enabled':'view-only'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}/>
    )
}    

export default WhiteboardCanvas