import {useState} from 'react' 
import api from '../../../services/api'

function CreatePost({onPostCreated}){
    const [content,setContent]=useState("")
    const [image,setImage]=useState(null)
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const handleImageChange=(event)=>{
        const file=event.target.files[0]
        if (file){
            setImage(file)
        }
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        if (!content.trim() && !image){
            setError('please add some content or an image')
            return
        }
        setLoading(true)
        setError("")
        try{
            const formData=new FormData()
            formData.append('content',content)
            if (image){
                formData.append('image',image)
            }
            const response=await api.post(
                'posts/create/',
                formData,
                {
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            const createdPost=response.data.post
            setContent("")
            setImage(null)
            event.target.reset()
            if (onPostCreated){
                onPostCreated(createdPost)
            }
        }catch(error){
            console.error('error creating post:',error)
            setError(
                error.response?.data?.error||
                'failed to create post'
            )
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className="card border-0 shadow-sm mb-4">

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <textarea
                        className="form-control border-0 mb-3"
                        rows="3"
                        placeholder="Share something with the SkillSwap community..."
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                    />

                    {image && (
                        <div className="mb-3">
                            <small className="text-muted">
                                Selected image: {image.name}
                            </small>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger py-2">
                            {error}
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">

                        <div className="d-flex gap-2">

                            <label
                                className="btn btn-light btn-sm"
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="bi bi-image me-1"></i>
                                Image

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="d-none"
                                    onChange={handleImageChange}
                                />
                            </label>


                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                            disabled={loading}
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default CreatePost