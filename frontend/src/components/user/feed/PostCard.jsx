import {useState} from 'react'
import api from '../../../services/api'
import CommentSection from './CommentSection'

function PostCard({post,currentUser,onPostDeleted}){
    const [liked,setLiked]=useState(post.liked_by_me||false)
    const [likesCount,setLikesCount]=useState(post.likes_count||0)
    const [showComments,setShowComments]=useState(false)
    const [deleting,setDeleting]=useState(false)
    const author=post.author
    const isOwnPost =
    currentUser &&
    post.author?.author_type === "USER" &&
    Number(post.author.id) === Number(currentUser.id);
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
                `posts/${post.id}/delete/`
            )
            if (onPostDeleted){
                onPostDeleted(post.id)
            }
        }catch(error){
            console.error('error deleting post:',error)
        }finally{
            setDeleting(false)
        }
    }
    const getAuthorName=()=>{
        if (!author){
            return 'unknown user'
        }
        return (
            author.full_name||
            author.username||
            'User'
        )
    }
    const getAuthorImage=()=>{
        if (!author){
            return '/default-avatar.png'
        }
        return (
            author.profile_image||
            '/default-avatar.png'
        )
    }
    return (
        <div className="card border-0 shadow-sm mb-4">

            <div className="card-body">

                {/* Author section */}

                <div className="d-flex justify-content-between align-items-start mb-3">

                    <div className="d-flex gap-3">

                        <img
                            src={getAuthorImage()}
                            alt=""
                            width="48"
                            height="48"
                            className="rounded-circle"
                            style={{ objectFit: 'cover' }}
                        />

                        <div>

                            <div className="fw-semibold">
                                {getAuthorName()}
                            </div>

                            {author?.username && (
                                <div className="text-muted small">
                                    @{author.username}
                                </div>
                            )}

                            <div className="text-muted small">
                                {new Date(
                                    post.created_at
                                ).toLocaleString()}
                            </div>

                        </div>

                    </div>

                    {isOwnPost && (
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            <i className="bi bi-trash"></i>

                            {deleting && (
                                <span className="ms-1">
                                    Deleting...
                                </span>
                            )}
                        </button>
                    )}

                </div>

                {/* Post content */}

                <div className="mb-3">

                    <p className="mb-0">
                        {post.content}
                    </p>

                </div>

                {/* Post image */}

                {post.image && (
                    <div className="mb-3">

                        <img
                            src={post.image}
                            alt="Post"
                            className="img-fluid rounded"
                            style={{
                                maxHeight: '500px',
                                width: '100%',
                                objectFit: 'cover'
                            }}
                        />

                    </div>
                )}

                {/* Post actions */}

                <div className="d-flex align-items-center gap-4">

                    <button
                        type="button"
                        className={`btn btn-sm ${
                            liked
                                ? 'text-primary'
                                : 'text-muted'
                        }`}
                        onClick={handleLike}
                    >
                        <i
                            className={`bi ${
                                liked
                                    ? 'bi-hand-thumbs-up-fill'
                                    : 'bi-hand-thumbs-up'
                            } me-1`}
                        ></i>

                        {likesCount} 
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm text-muted"
                        onClick={() =>
                            setShowComments(
                                (current) => !current
                            )
                        }
                    >
                        <i className="bi bi-chat me-1"></i>

                        {post.comments_count || 0}
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm text-muted"
                    >
                        <i className="bi bi-share me-1"></i>
                        Share
                    </button>

                </div>

                {/* Comments */}

                {showComments && (
                    <CommentSection
                        postId={post.id}
                    />
                )}

            </div>

        </div>
    )
}

export default PostCard