import React,{useState} from "react";

const AddSkillModal=({
    show,
    onClose,
    onSubmit
})=>{
    const [name,setName]=useState('')
    const [slug,setSlug]=useState('')
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState('')
    if (!show){
        return null
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        if (!name.trim()){
            setError('skill name is required')
            return
        }
        try{
            setLoading(true)
            setError('')
            await onSubmit({
                name:name.trim(),
                slug:slug.trim()
            })
            setName('')
            setSlug('')
        }catch(error){
            setError(error.response?.data?.name?.[0]||
                error.response?.data?.detail||
                'failed to create skill'
            )
        }finally{
            setLoading(false)
        }
    }
    return (
        <>

            <div
                className="modal fade show d-block"
                tabIndex="-1"
                style={{
                    backgroundColor:
                        'rgba(0,0,0,.5)'
                }}
            >

                <div className="modal-dialog modal-dialog-centered">

                    <div className="modal-content">

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="modal-header">

                                <h5 className="modal-title fw-bold">
                                    Add Skill
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={onClose}
                                />

                            </div>


                            <div className="modal-body">

                                {error && (

                                    <div className="alert alert-danger py-2">

                                        {error}

                                    </div>

                                )}


                                <div className="mb-3">

                                    <label className="form-label">
                                        Skill Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Django"
                                        value={name}
                                        onChange={(event) =>
                                            setName(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Slug
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Slug text of the skill..."
                                        value={
                                            description
                                        }
                                        onChange={(event) =>
                                            setSlug(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-light"
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

                                    {loading ? (

                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                            />

                                            Creating...

                                        </>

                                    ) : (

                                        'Add Skill'

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </>
    )
}

export default AddSkillModal