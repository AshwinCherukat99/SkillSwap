import {useState} from "react";
import {useSelector} from 'react-redux'
import CommentSection from "../feed/CommentSection";
import api from "../../../services/api";

function PostCard({
    post,
    currentUser,
    onLike,
    onComment,
    onEdit,
    onDelete,
}) {
    const [liked,setLiked]=useState(post.liked_by_me||false)
        const [likesCount,setLikesCount]=useState(post.likes_count||0)
        const [showComments,setShowComments]=useState(false)
        const [deleting,setDeleting]=useState(false)
        const author=post.author
        const isOwnPost =
        currentUser &&
        post.author?.author_type === "USER" &&
        Number(post.author.id) === Number(currentUser.id);
    const getImageUrl = (image) => {
        if (!image) return null;

        if (image.startsWith("http")) {
            return image;
        }

        return `http://127.0.0.1:8000${image}`;
    };

    const formatDate = (date) => {
        const created = new Date(date);
        const now = new Date();

        const seconds = Math.floor(
            (now - created) / 1000
        );

        if (seconds < 60) return "Just now";

        const minutes = Math.floor(seconds / 60);

        if (minutes < 60) {
            return `${minutes}m ago`;
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours}h ago`;
        }

        const days = Math.floor(hours / 24);

        if (days < 7) {
            return `${days}d ago`;
        }

        return created.toLocaleDateString();
    };

    console.log("POST:", post);
console.log("CURRENT USER:", currentUser);
console.log("AUTHOR:", author);
const handleLike=async ()=>{
        console.log("LIKE CLICKED");
    console.log("POST ID:", post.id);
    console.log("CURRENT LIKED:", liked);
        try{
            if (liked){
                console.log("SENDING DELETE");
                const response=await api.delete(
                    `/posts/${post.id}/like/`
                )
                setLiked(false)
                setLikesCount(
                    response.data.likes_count
                )
            }else{
                console.log("SENDING POST");
                const response=await api.post(
                    `/posts/${post.id}/like/`
                )
                setLiked(true)
                setLikesCount(response.data.likes_count)
            }
            console.log("LIKE RESPONSE:", response.status);
        console.log("LIKE RESPONSE DATA:", response.data);
        }catch(error){
            console.log('error updating like:',error)
        }
    }
    const handleDelete=async ()=>{
        const confirmed=window.confirm(
            'are you sure you want to delete this post?'
        )
        if (!confirmed){
            return
        }
        setDeleting(true)
        try{
            await api.delete(
                `/posts/${post.id}/delete/`
            )
            if (onDelete){
                onDelete(post.id)
            }
        }catch(error){
            console.error('error deleting post:',error)
        }finally{
            setDeleting(false)
        }
    }
    return (
        <div className="card post-card border-0 shadow-sm rounded-4">

            <div className="card-body p-4">

                {/* =========================
                    AUTHOR HEADER
                ========================= */}

                <div className="d-flex justify-content-between align-items-start">

                    <div className="d-flex align-items-center gap-3">

                        <img
                            src={
                                getImageUrl(
                                    author?.profile_image
                                ) ||
                                "/default-user.png"
                            }
                            alt={author?.username || "User"}
                            className="post-author-image"
                        />

                        <div>

                            <div className="d-flex align-items-center gap-1">

                                <span className="fw-semibold post-author-name">
                                    {author?.username}
                                </span>

                                {author?.is_verified && (
                                    <span
                                        className="material-symbols-outlined text-success post-verified-icon"
                                        title="Verified"
                                    >
                                        verified
                                    </span>
                                )}

                            </div>

                            <div className="text-muted small">

                                {formatDate(post.created_at)}

                            </div>

                        </div>

                    </div>


                    {/* OWNER MENU */}

                    {isOwnPost && (

                        <div className="dropdown">

                            <button
                                className="btn btn-link text-dark p-0"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <span className="material-symbols-outlined">
                                    more_horiz
                                </span>
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end">

                                <li>
                                    <button
                                        type="button"
                                        className="dropdown-item d-flex align-items-center gap-2"
                                        onClick={() =>
                                            onEdit?.(post)
                                        }
                                    >
                                        <span className="material-symbols-outlined">
                                            edit
                                        </span>

                                        Edit Post
                                    </button>
                                </li>

                                <li>
                                    <button
                                        type="button"
                                        className="dropdown-item text-danger d-flex align-items-center gap-2"
                                        onClick={
                                            handleDelete
                                        }
                                        disabled={deleting}
                                    >
                                        <span className="material-symbols-outlined">
                                            delete
                                        </span>

                                        Delete Post
                                    </button>
                                </li>

                            </ul>

                        </div>

                    )}

                </div>


                {/* =========================
                    CONTENT
                ========================= */}

                <p className="post-content mt-4 mb-3">
                    {post.content}
                </p>


                {/* =========================
                    POST IMAGE
                ========================= */}

                {post.image && (

                    <div className="post-image-wrapper mb-3">

                        <img
                            src={getImageUrl(post.image)}
                            alt="Post"
                            className="post-image"
                        />

                    </div>

                )}


                {/* =========================
                    ACTIONS
                ========================= */}

                <div className="post-actions border-top pt-3 mt-3">

                    <button
                        type="button"
                        className={`post-action ${
                            liked
                                ? "post-action-liked"
                                : ""
                        }`}
                        onClick={handleLike
                        }
                    >
                        <span className="material-symbols-outlined">
                            {liked
                                ? "favorite"
                                : "favorite_border"}
                        </span>

                        <span>
                            {likesCount || 0}{" "}
                            {likesCount === 1
                                ? "Like"
                                : "Likes"}
                        </span>
                    </button>


                    <button
                        type="button"
                        className="post-action"
                        onClick={()=>setShowComments(
                            (current)=>!current
                        )
                        }
                    >
                        <span className="material-symbols-outlined">
                            chat_bubble
                        </span>

                        <span>
                            {post.comments_count || 0}{" "}
                            {post.comments_count === 1
                                ? "Comment"
                                : "Comments"}
                        </span>
                    </button>


                    {/* Not functional yet */}

                    <button
                        type="button"
                        className="post-action"
                    >
                        <span className="material-symbols-outlined">
                            event
                        </span>

                        <span>
                            Request Session
                        </span>
                    </button>


                    {/* Not functional yet */}

                    <button
                        type="button"
                        className="post-action ms-auto"
                    >
                        <span className="material-symbols-outlined">
                            share
                        </span>

                        <span className="d-none d-md-inline">
                            Share
                        </span>
                    </button>

                </div>
                {showComments && (
                    <CommentSection
                        postId={post.id}
                    />
                )}


            </div>

        </div>
    );
}

export default PostCard;