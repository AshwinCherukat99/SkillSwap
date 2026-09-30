import React,{useState} from "react";

const RejectSkillModal=({
    suggestion,
    onClose,
    onSubmit
})=>{
    const [reason,setReason]=useState('')
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState('')
    if (!suggestion){
        return null
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        if (!reason.trim()){
            setError('please provide a rejection reason')
            return
        }
        try{
            setLoading(true)
            setError('')
            await onSubmit(
                suggestion.id,
                reason.trim()
            )
            setReason('')
        }catch(error){
            setError(error.response?.data?.rejection_reason?.[0]||
                error.response?.data?.error||
                'failed to reject suggestion'
            )
        }finally{
            setLoading(false)
        }
    }
    return (
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
                                Reject Skill Suggestion
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            />

                        </div>


                        <div className="modal-body">

                            <p className="mb-3">

                                You are rejecting:

                                <strong className="ms-1">
                                    {suggestion.name}
                                </strong>

                            </p>


                            {error && (

                                <div className="alert alert-danger py-2">
                                    {error}
                                </div>

                            )}


                            <label className="form-label">
                                Rejection Reason
                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Explain why this skill suggestion is being rejected..."
                                value={reason}
                                onChange={(event) =>
                                    setReason(
                                        event.target.value
                                    )
                                }
                            />

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
                                className="btn btn-danger"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                        />

                                        Rejecting...

                                    </>

                                ) : (

                                    'Reject Suggestion'

                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default RejectSkillModal