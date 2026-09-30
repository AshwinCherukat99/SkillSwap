import React,{useRef,useEffect,useState} from "react";

const UserActionMenu=({
    user,
    onView,
    onEdit,
    onBlock,
    onSuspend,
    onActivate,
})=>{
    const [open,setOpen]=useState(false)
    const menuRef=useRef(null)
    useEffect(()=>{
        const handleOutsideClick=(event)=>{
            if (menuRef.current&&!menuRef.current.contains(event.target)){
                setOpen(false)
            }
        }
        document.addEventListener('mousedown',handleOutsideClick)
        return ()=>{
            return ()=>{
                document.removeEventListener('mousedown',handleOutsideClick)
            }
        }
    },[])
    const handleAction=(callback)=>{
        setOpen(false)
        callback(user)
    }
    return (
        <div
            className="dropdown"
            ref={menuRef}
        >

            <button
                type="button"
                className="btn btn-light btn-sm rounded-circle"
                onClick={() =>
                    setOpen(!open)
                }
            >
                <i className="bi bi-three-dots-vertical"></i>
            </button>

            {open && (

                <div
                    className="dropdown-menu show shadow border-0"
                    style={{
                        right: 0,
                        left: 'auto',
                        minWidth: '190px',
                    }}
                >

                    <button
                        className="dropdown-item"
                        onClick={() =>
                            handleAction(onView)
                        }
                    >
                        <i className="bi bi-person me-2"></i>
                        View Profile
                    </button>


                    <button
                        className="dropdown-item"
                        onClick={() =>
                            handleAction(onEdit)
                        }
                    >
                        <i className="bi bi-pencil me-2"></i>
                        Edit User
                    </button>


                    <div className="dropdown-divider"></div>


                    {user.status === 'ACTIVE' && (

                        <>
                            <button
                                className="dropdown-item text-danger"
                                onClick={() =>
                                    handleAction(
                                        onBlock
                                    )
                                }
                            >
                                <i className="bi bi-slash-circle me-2"></i>
                                Block User
                            </button>

                            <button
                                className="dropdown-item text-warning"
                                onClick={() =>
                                    handleAction(
                                        onSuspend
                                    )
                                }
                            >
                                <i className="bi bi-pause-circle me-2"></i>
                                Suspend User
                            </button>
                        </>

                    )}


                    {(user.status === 'BLOCKED' ||
                        user.status === 'SUSPENDED') && (

                        <button
                            className="dropdown-item text-success"
                            onClick={() =>
                                handleAction(
                                    onActivate
                                )
                            }
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            Activate User
                        </button>

                    )}


                    <div className="dropdown-divider"></div>

                </div>

            )}

        </div>
    )
}

export default UserActionMenu