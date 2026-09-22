import {useState,useEffect} from 'react'
import api from '../../../services/api'

function CommentSection({postId}){
    const [comments,setComments]=useState([])
    const [commentText,setCommentText]=useState("")
    const [loading,setLoading]=useState(false)
    const [submitting,setSubmitting]=useState(false)
    const [error,setError]=useState('')
    useEffect(()=>{
        fetchComments()
    },[postId])
    const fetchComments=async ()=>{
        setLoading(true)
        setError('')
        try{
            const response=await api.get(
                `/posts/${postId}/comments/`
            )
            setComments(response.data)
        }catch(error){
            console.error('error fetching comments:',error)
            setError('failed to load comments')
        }finally{
            setLoading(false)
        }
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        if (!commentText.trim()){
            return
        }
        setSubmitting(true)
        try{
            const response=await api.post(
                `posts/${postId}/comments/`,
                {
                    content:commentText.trim()
                }
            )
            setComments((currentComments)=>[
                ...currentComments,
                response.data
            ])
            setCommentText('')
        }catch(error){
            console.error('error adding comment:',error)
            setError(
                error?.response?.data?.content[0]
            )
        }finally{
            setSubmitting(false)
        }
    }
    return (
        <div className="mt-3">

            <hr />

            <h6 className="mb-3">
                Comments
            </h6>

            {loading && (
                <div className="text-muted small">
                    Loading comments...
                </div>
            )}

            {error && (
                <div className="text-danger small mb-2">
                    {error}
                </div>
            )}

            {!loading && comments.length === 0 && (
                <p className="text-muted small">
                    No comments yet. Be the first to comment.
                </p>
            )}

            <div className="mb-3">

                {comments.map((comment) => (

                    <div
                        key={comment.id}
                        className="d-flex gap-2 mb-3"
                    >

                        <img
                            src={
                                comment.user?.profile_image ||
                                '/default-avatar.png'
                            }
                            alt=""
                            width="36"
                            height="36"
                            className="rounded-circle"
                            style={{ objectFit: 'cover' }}
                        />

                        <div>

                            <div className="fw-semibold small">
                                {comment.user?.full_name ||
                                    comment.user?.username}
                            </div>

                            <div className="small text-muted">
                                {comment.content}
                            </div>

                        </div>

                    </div>

                ))}

            </div>

            <form onSubmit={handleSubmit}>

                <div className="input-group">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(event) =>
                            setCommentText(event.target.value)
                        }
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={
                            submitting ||
                            !commentText.trim()
                        }
                    >
                        {submitting ? '...' : 'Comment'}
                    </button>

                </div>

            </form>

        </div>
    )
}

export default CommentSection