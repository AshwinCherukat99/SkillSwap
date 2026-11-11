import { useEffect,useState } from "react";

import api from "../../../services/api";

const reactions=[
    { emoji: "❤️", value: "LOVE" },
    { emoji: "🔥", value: "LIKE" },
    { emoji: "👏", value: "CLAP" },
    { emoji: "💡", value: "WOW" },
    { emoji: "🚀", value: "LAUGH" },
]

const StoryViewer=({
    story,
    onClose,
    onNext,
    onPrevious,
    onDeleted
})=>{
    const [paused,setPaused]=useState(false)
    const [muted,setMuted]=useState(false)
    const [progress,setProgress]=useState(0)
    const [reply,setReply]=useState('')
    const [toast,setToast]=useState('')
    const [showMenu,setShowMenu]=useState(false)
    useEffect(()=>{
        setProgress(0)
        setPaused(false)
        setReply('')
    },[story.id])
    useEffect(()=>{
        if (paused) return
        const timer=setInterval(()=>{
            setProgress((previous)=>{
                if (previous>=100){
                    return 100
                }
                return previous+1
            })
        },100)
        return ()=>clearInterval(timer)
    },[paused,story.id])
    useEffect(()=>{
        if (progress>=100){
            onNext()
        }
    },[progress,onNext])
    const showToast=(message)=>{
        setToast(message)
        setTimeout(()=>setToast(''),1800)
    }
    const handleReaction=async (reaction)=>{
        try{
            await api.post(
                `/stories/${story.id}/react/`,
                {reaction}
            )
            showToast('reaction sent successfully')
        }catch(err){
            console.error('reaction failed:',err)
            showToast('unable to send reaction')
        }
    }
    const handleReply=async (e)=>{
        e.preventDefault()
        if (!reply.trim()) return

    }
    const handeDelete=()=>{
        if (window.confirm('are you sure you want to delet this story?')){
            onDeleted(story.id)
        }
    }
    const mediaUrl=story.media
    return (
        <div className="story-viewer">

            {/* Background media */}
            <div className="story-viewer-background">
                {story.content_type === "IMAGE" && mediaUrl && (
                    <img src={mediaUrl} alt="Story" />
                )}

                {story.content_type === "VIDEO" && mediaUrl && (
                    <video
                        src={mediaUrl}
                        autoPlay
                        muted={muted}
                        playsInline
                    />
                )}

                {story.content_type === "TEXT" && (
                    <div
                        className="story-text-background"
                        style={{
                            backgroundColor:
                                story.background_color || "#3525cd",
                        }}
                    >
                        <h2>{story.text}</h2>
                    </div>
                )}
            </div>

            <div className="story-viewer-overlay" />

            {/* Progress */}
            <div className="story-progress-track">
                <div
                    className="story-progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Header */}
            <div className="story-viewer-header">

                <div className="d-flex align-items-center gap-2">
                    <img
                        src={story.profile_image || "/default-avatar.png"}
                        alt={story.username}
                        className="story-viewer-avatar"
                    />

                    <div>
                        <strong>
                            {story.full_name || story.username}
                        </strong>
                        <small>
                            @{story.username}
                        </small>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-1">

                    <button
                        className="story-control-btn"
                        onClick={() => setPaused(!paused)}
                        title={paused ? "Play" : "Pause"}
                    >
                        <span className="material-symbols-outlined">
                            {paused ? "play_arrow" : "pause"}
                        </span>
                    </button>

                    {story.content_type === "VIDEO" && (
                        <button
                            className="story-control-btn"
                            onClick={() => setMuted(!muted)}
                            title={muted ? "Unmute" : "Mute"}
                        >
                            <span className="material-symbols-outlined">
                                {muted ? "volume_off" : "volume_up"}
                            </span>
                        </button>
                    )}

                    <div className="position-relative">
                        <button
                            className="story-control-btn"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <span className="material-symbols-outlined">
                                more_vert
                            </span>
                        </button>

                        {showMenu && (
                            <div className="story-menu shadow">
                                <button onClick={handleDelete}>
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                    Delete story
                                </button>

                                <button onClick={onClose}>
                                    <span className="material-symbols-outlined">
                                        close
                                    </span>
                                    Close viewer
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        className="story-control-btn"
                        onClick={onClose}
                    >
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </div>
            </div>

            {/* Navigation zones */}
            <div className="story-navigation-zones">
                <button
                    aria-label="Previous story"
                    onClick={onPrevious}
                />

                <button
                    aria-label="Next story"
                    onClick={onNext}
                />
            </div>

            {/* Story text content */}
            {story.content_type !== "TEXT" && story.text && (
                <div className="story-caption">
                    {story.text}
                </div>
            )}

            {/* Footer */}
            <div className="story-viewer-footer">

                <div className="story-reactions">
                    {reactions.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => handleReaction(item.value)}
                            title={item.value}
                        >
                            {item.emoji}
                        </button>
                    ))}
                </div>

                <form
                    className="story-reply-form"
                    onSubmit={handleReply}
                >
                    <input
                        type="text"
                        placeholder={`Reply to ${story.full_name || story.username}...`}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                    />

                    <button type="submit">
                        <span className="material-symbols-outlined">
                            send
                        </span>
                    </button>
                </form>

            </div>

            {toast && (
                <div className="story-toast">
                    {toast}
                </div>
            )}

        </div>
    )
}

export default StoryViewer