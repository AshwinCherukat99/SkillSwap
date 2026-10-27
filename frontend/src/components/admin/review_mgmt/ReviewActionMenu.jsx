import React,{useEffect,useRef} from "react";

const ReviewActionMenu=({
    review,
    onHide,
    onRestore,
    onDelete,
    onViewReports
})=>{
    const [open,setOpen]=React.useState(false)
    const menuRef=useRef(null)
    useEffect(()=>{
        const handleOutsideClick=(event)=>{
            if (menuRef.current && !menuRef.current.contains(event.target)){
                setOpen(false)
            }
        }
        document.addEventListener('mousedown',handleOutsideClick)
        return ()=>{
            document.removeEventListener('mousedown',handleOutsideClick)
        }
    },[])
    const handleAction=(callback)=>{
        setOpen(false)
        callback(review)
    }
    return (
        <div
            className="dropdown"
            ref={menuRef}
        >

            <button
                type="button"
                className="btn btn-light btn-sm"
                onClick={() => setOpen(!open)}
            >
                <i className="bi bi-three-dots-vertical"></i>
            </button>

            {open && (
                <div
                    className="dropdown-menu dropdown-menu-end show"
                    style={{
                        position: "absolute",
                        right: 0,
                    }}
                >

                    <button
                        className="dropdown-item"
                        onClick={() =>
                            handleAction(onViewReports)
                        }
                    >
                        <i className="bi bi-flag me-2"></i>
                        View Reports

                        {review.report_count > 0 && (
                            <span className="badge bg-danger ms-2">
                                {review.report_count}
                            </span>
                        )}
                    </button>

                    <div className="dropdown-divider"></div>

                    {review.is_hidden ? (

                        <button
                            className="dropdown-item text-success"
                            onClick={() =>
                                handleAction(onRestore)
                            }
                        >
                            <i className="bi bi-eye me-2"></i>
                            Restore Review
                        </button>

                    ) : (

                        <button
                            className="dropdown-item"
                            onClick={() =>
                                handleAction(onHide)
                            }
                        >
                            <i className="bi bi-eye-slash me-2"></i>
                            Hide Review
                        </button>

                    )}

                    <button
                        className="dropdown-item text-danger"
                        onClick={() =>
                            handleAction(onDelete)
                        }
                    >
                        <i className="bi bi-trash me-2"></i>
                        Remove Review
                    </button>

                </div>
            )}

        </div>
    )
}

export default ReviewActionMenu