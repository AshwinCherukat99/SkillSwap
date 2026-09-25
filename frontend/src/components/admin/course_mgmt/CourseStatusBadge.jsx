import React from "react";

const CourseStatusBadge=({status})=>{
    const config={
        DRAFT:{
            label:'Draft',
            className:'bg-secondary-subtle text-secondary'
        },
        PENDING_REVIEW:{
            label:'Pending Review',
            className:'bg-subtle-warning text-warning',
        },
        DRAFT:{
            label:'Draft',
            className:'bg-secondary-subtle text-secondary'
        },
        PUBLISHED:{
            label:'Published',
            className:'bg-success-subtle text-success'
        },
        REJECTED:{
            label:'Rejected',
            className:'bg-danger-subtle text-danger'
        },
    }
    const current=config[status]||
    {
        label:status,
        className:'bg-secondary-subtle text-secondary'
    }
    return (
        <span
            className={`badge rounded-pill ${current.className}`}
        >
            {current.label}
        </span>
    )
}

export default CourseStatusBadge