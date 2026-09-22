import {useEffect,useState} from 'react'
import api from '../../../services/api'

function EditPost({post,onClose,onUpdated}){
    const [content,setContent]=useState('')
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState('')
    useEffect(()=>{
        if (post){
            setContent(post.content||'')
            setError('')
        }
    },[post])
    if (!post){
        return null
    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        if (!content.trim()){
            setError('post content cannot be empty')
            return
        }
        setLoading(true)
        setError('')
        try{
            const response=await api.patch(
                `/posts/${post.id}/edit/`,
                {
                    content:content.trim()
                }
            )
            onUpdated(response.data.post)
            onClose()
        }catch(error){
            console.error('error updating post:',error)
            setError(error.response?.data?.detail||error.response?.data?.error||'failed to update post')
        }finally{
            setLoading(false)
        }
    }
    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            Edit Post
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={loading}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="modal-body">

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <label className="form-label">
                                Post content
                            </label>

                            <textarea
                                className="form-control"
                                rows="5"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={loading}
                                autoFocus
                            />

                        </div>

                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default EditPost