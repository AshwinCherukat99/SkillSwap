const DeleteCategoryModal=({
    show,
    category,
    onClose,
    onConfirm,
    deleting
})=>{
    if (!show||!category) return null
    const courseCount=Number(
        category.course_count??
        category.courses_count??
        0
    )
    return (
        <div className="category-modal-overlay">

            <div className="category-modal-backdrop" onClick={onClose}></div>

            <div className="category-modal-content card border-0 shadow-lg">

                <div className="card-body p-4 p-md-5">

                    <div className="d-flex justify-content-between align-items-start">

                        <div className="d-flex align-items-center gap-3">

                            <div className="category-delete-icon">
                                <i className="bi bi-exclamation-triangle"></i>
                            </div>

                            <div>
                                <h5 className="fw-bold text-danger mb-1">
                                    Delete Category?
                                </h5>

                                <small className="text-muted">
                                    Destructive action
                                </small>
                            </div>

                        </div>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        ></button>

                    </div>

                    <div className="mt-4">

                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{category.name}</strong>?
                        </p>

                        <div className="alert alert-danger small d-flex gap-2">

                            <i className="bi bi-exclamation-circle fs-5"></i>

                            <div>
                                {courseCount === 0 ? (
                                    <>
                                        This category has no courses assigned
                                        and can be deleted.
                                    </>
                                ) : (
                                    <>
                                        This category currently has{" "}
                                        <strong>{courseCount} courses</strong>{" "}
                                        assigned. You cannot delete it until
                                        those courses are reassigned or removed.
                                    </>
                                )}
                            </div>

                        </div>

                    </div>

                    <div className="d-flex justify-content-end gap-2 pt-3">

                        <button
                            className="btn btn-light px-4"
                            onClick={onClose}
                            disabled={deleting}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn btn-danger px-4"
                            onClick={onConfirm}
                            disabled={deleting || courseCount > 0}
                        >
                            {deleting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Deleting...
                                </>
                            ) : (
                                "Confirm Delete"
                            )}
                        </button>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default DeleteCategoryModal