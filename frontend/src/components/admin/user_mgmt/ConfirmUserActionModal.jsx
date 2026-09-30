import React from "react";

const ConfirmUserActionModal=({
    show,
    title,
    message,
    confirmText,
    confirmClass='btn-danger',
    loading,
    onConfirm,
    onCancel
})=>{
    if (!show){
        return null
    }
    return (
        <div
            className="modal d-block"
            style={{
                backgroundColor:
                    'rgba(0,0,0,.45)',
                zIndex: 1055,
            }}
        >

            <div className="modal-dialog modal-dialog-centered">

                <div className="modal-content border-0 shadow">

                    <div className="modal-header">

                        <h5 className="modal-title">
                            {title}
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onCancel}
                            disabled={loading}
                        />

                    </div>


                    <div className="modal-body">

                        <p className="text-muted mb-0">
                            {message}
                        </p>

                    </div>


                    <div className="modal-footer">

                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className={`btn ${confirmClass}`}
                            onClick={onConfirm}
                            disabled={loading}
                        >

                            {loading && (

                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                />

                            )}

                            {confirmText}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default ConfirmUserActionModal