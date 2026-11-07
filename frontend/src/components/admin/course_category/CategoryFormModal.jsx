import { useEffect,useState } from "react";

const CategoryFormModal=({
    show,
    mode,
    category,
    onClose,
    onSubmit,
    saving
})=>{
    const [name,setName]=useState('')
    useEffect(()=>{
        if (show){
            setName(mode==='edit'?category?.name||'':'')
        }
    },[show,mode,category])
    if (!show) return null
    const handleSubmit=(e)=>{
        e.preventDefault()
        if (!name.trim()) return
        onSubmit(name.trim())
    }
    return (
        <div className="category-modal-overlay">
            <div className="category-modal-backdrop" onClick={onClose}></div>

            <div className="category-modal-content card border-0 shadow-lg">

                <div className="card-body p-4 p-md-5">

                    <div className="d-flex justify-content-between align-items-start mb-4">

                        <div className="d-flex align-items-center gap-3">

                            <div className="category-modal-icon">
                                <i className={`bi ${mode === "edit" ? "bi-pencil-square" : "bi-folder-plus"}`}></i>
                            </div>

                            <div>
                                <h5 className="fw-bold mb-1">
                                    {mode === "edit"
                                        ? "Edit Category"
                                        : "Create New Category"}
                                </h5>

                                <p className="text-muted small mb-0">
                                    {mode === "edit"
                                        ? "Update the category name."
                                        : "Add a new category for SkillSwap courses."}
                                </p>
                            </div>

                        </div>

                        <button
                            className="btn-close"
                            onClick={onClose}
                            type="button"
                        ></button>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">

                            <label className="form-label fw-semibold">
                                Category Name <span className="text-danger">*</span>
                            </label>

                            <input
                                type="text"
                                className="form-control category-input"
                                placeholder="Enter category name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={100}
                                required
                                autoFocus
                            />

                        </div>

                        {mode === "edit" && (
                            <div className="alert alert-primary d-flex gap-2 align-items-start small">
                                <i className="bi bi-info-circle mt-1"></i>

                                <span>
                                    Renaming this category will preserve its
                                    existing course associations.
                                </span>
                            </div>
                        )}

                        <div className="d-flex justify-content-end gap-2 pt-3">

                            <button
                                type="button"
                                className="btn btn-light px-4"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                                disabled={saving || !name.trim()}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Saving...
                                    </>
                                ) : (
                                    mode === "edit"
                                        ? "Save Changes"
                                        : "Create Category"
                                )}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default CategoryFormModal