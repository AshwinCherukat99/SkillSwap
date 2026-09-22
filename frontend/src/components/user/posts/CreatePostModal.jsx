import {useState} from 'react'

import api from '../../../services/api'

function CreatePostModal({onPostCreated,onClose}){
    const [content,setContent]=useState("")
    const [image,setImage]=useState(null)
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const handleSubmit=async (event)=>{
        event.preventDefault()
        if (!content.trim()){
            setError('post content cannot be empty')
            return
        }
        try{
            setLoading(true)
            setError("") 
            const formData=new FormData()
            formData.append('content',content)
            if (image){
                formData.append('image',image)
            }
            const response=await api.post('/posts/create/',formData,{
                headers: {
            'Content-Type': 'multipart/form-data',
        },
            })  
            onPostCreated(response.data.post)
            setContent("")
            setImage(null)
            onClose()
        }catch(err){
            console.error('create post error:',err.response?.data||err)
            setError(
                err.response?.data?.detail||
                err.response?.data?.error||
                err.response?.data?.content?.[0]||
                'unable to create post'
            )
        }finally{
            setLoading(false)
        }
    }
    return (
        <div
            className="modal fade show"
            style={{
                display: "block",
                backgroundColor:
                    "rgba(0,0,0,0.45)",
            }}
        >

            <div className="modal-dialog modal-dialog-centered">

                <div className="modal-content">

                    <div className="modal-header">

                        <h5 className="modal-title">

                            Create New Post

                        </h5>


                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        />

                    </div>


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div className="modal-body">

                            {error && (

                                <div className="alert alert-danger">

                                    {error}

                                </div>

                            )}


                            <div className="mb-3">

                                <label className="form-label">

                                    What would you like to share?

                                </label>


                                <textarea
                                    className="form-control"
                                    rows="5"
                                    value={content}
                                    onChange={
                                        (event) =>
                                            setContent(
                                                event.target.value
                                            )
                                    }
                                    placeholder="Write something..."
                                />

                            </div>


                            <div className="mb-3">

                                <label className="form-label">

                                    Add Image

                                </label>


                                <input
                                    type="file"
                                    className="form-control"
                                    accept="
                                        image/jpeg,
                                        image/png,
                                        image/webp
                                    "
                                    onChange={
                                        (event) =>
                                            setImage(
                                                event.target.files[0]
                                            )
                                    }
                                />

                            </div>


                            {image && (

                                <p className="small text-muted">

                                    Selected:
                                    {" "}
                                    {image.name}

                                </p>

                            )}

                        </div>


                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onClose}
                            >

                                Cancel

                            </button>


                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >

                                {loading
                                    ? "Posting..."
                                    : "Publish Post"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default CreatePostModal