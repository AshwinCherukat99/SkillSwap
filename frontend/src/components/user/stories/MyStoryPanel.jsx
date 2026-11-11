import { useEffect,useState } from "react";

import api from "../../../services/api";

const MyStoryPanel=({
    myStories,
    onOpenStory,
    onDeleteStory
})=>{
    const [viewers,setViewers]=useState([])
    const [selectedStoryId,setSelectedStoryId]=useState(null)
    const [loadingViewers,setLoadingViewers]=useState(false)
    const activeStory=myStories[0]
    useEffect(()=>{
        if (!activeStory){
            setViewers([])
            setSelectedStoryId(null)
            return
        }
        if (selectedStoryId===activeStory.id) return
    const fetchViewers=async ()=>{
        try{
            setLoadingViewers(true)
            const response=await api.get(
                `/stories/${activeStory.id}/viewers/`
            )
            setViewers(
                Array.isArray(response.data)?
                response.data:
                response.data.results||[]
            )
            setSelectedStoryId(activeStory.id)
        }catch(err){
            console.error('unable to fetch story viewers:',err)
            setViewers([])
        }finally{
            setLoadingViewers(false)
        }
    }
    fetchViewers()
    },[activeStory,selectedStoryId])
    if (!activeStory){
        return (
            <div className="my-story-panel">
                <div className="my-story-empty">
                    <span className="material-symbols-outlined">
                        auto_stories
                    </span>

                    <h5>No active stories</h5>

                    <p>
                        Your stories and their viewer insights will
                        appear here after you publish one.
                    </p>
                </div>
            </div>
        )
    }
    const totalViews=activeStory.total_views??viewers.length
    const totalReactions=activeStory.total_reactions??0
    return (
        <div className="d-flex flex-column gap-4">

            {/* My active story */}
            <div className="my-story-panel">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="my-story-icon">
                            <span className="material-symbols-outlined">
                                auto_stories
                            </span>
                        </div>

                        <div>
                            <h5>My Active Story</h5>
                            <small>
                                {new Date(activeStory.created_at).toLocaleString()}
                            </small>
                        </div>
                    </div>

                    <span className="story-live-badge">
                        <span /> LIVE
                    </span>
                </div>

                {/* Story preview */}
                <div
                    className="my-story-preview"
                    onClick={() => onOpenStory(activeStory)}
                >
                    <div className="my-story-thumbnail">
                        {activeStory.content_type === "IMAGE" && (
                            <img
                                src={activeStory.media}
                                alt="My story"
                            />
                        )}

                        {activeStory.content_type === "VIDEO" && (
                            <video
                                src={activeStory.media}
                                muted
                            />
                        )}

                        {activeStory.content_type === "TEXT" && (
                            <div
                                className="my-story-text-thumbnail"
                                style={{
                                    backgroundColor:
                                        activeStory.background_color || "#3525cd",
                                }}
                            >
                                <span>{activeStory.text}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-grow-1 min-width-0">
                        <h6>
                            {activeStory.text || "Your story"}
                        </h6>

                        <div className="d-flex gap-3 mt-2">
                            <span className="text-primary">
                                <span className="material-symbols-outlined">
                                    visibility
                                </span>
                                {totalViews}
                            </span>

                            <span className="text-success">
                                <span className="material-symbols-outlined">
                                    favorite
                                </span>
                                {totalReactions}
                            </span>
                        </div>

                        <small className="text-secondary d-block mt-2">
                            Expires:{" "}
                            {new Date(activeStory.expires_at).toLocaleString()}
                        </small>
                    </div>
                </div>

                {/* Recent viewers */}
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <strong>Recent Viewers</strong>

                        <span className="text-primary small fw-semibold">
                            {totalViews} views
                        </span>
                    </div>

                    {loadingViewers ? (
                        <div className="text-center py-3">
                            <div className="spinner-border spinner-border-sm text-primary" />
                        </div>
                    ) : viewers.length > 0 ? (
                        <div className="story-viewer-list">
                            {viewers.slice(0, 5).map((viewer) => (
                                <div
                                    className="story-viewer-list-item"
                                    key={viewer.id}
                                >
                                    <img
                                        src={
                                            viewer.profile_image ||
                                            "/default-avatar.png"
                                        }
                                        alt={viewer.username}
                                    />

                                    <div>
                                        <strong>
                                            {viewer.full_name || viewer.username}
                                        </strong>

                                        <small>
                                            Viewed{" "}
                                            {new Date(
                                                viewer.viewed_at
                                            ).toLocaleString()}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-secondary small">
                            No viewers yet.
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="row g-2 mt-3">
                    <div className="col-6">
                        <button
                            className="btn btn-light w-100"
                            onClick={() => onOpenStory(activeStory)}
                        >
                            <span className="material-symbols-outlined">
                                visibility
                            </span>
                            View
                        </button>
                    </div>

                    <div className="col-6">
                        <button
                            className="btn btn-outline-danger w-100"
                            onClick={() => {
                                if (
                                    window.confirm(
                                        "Delete this story permanently?"
                                    )
                                ) {
                                    onDeleteStory(activeStory.id);
                                }
                            }}
                        >
                            <span className="material-symbols-outlined">
                                delete
                            </span>
                            Delete
                        </button>
                    </div>
                </div>

            </div>

            {/* Learning streak */}
            <div className="story-streak-card">
                <div className="story-streak-icon">
                    <span className="material-symbols-outlined">
                        local_fire_department
                    </span>
                </div>

                <div>
                    <h6>Keep sharing your progress! 🔥</h6>
                    <p>
                        Share your learning milestones with the SkillSwap
                        community.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default MyStoryPanel