import React from "react";      

const SessionStatusBadge=({status})=>{
    const normalized=String(status||'').toUpperCase().replace('-','_')
    const config={
        COMPLETED:{
            label:'Completed',
            className:'status-completed',
        },
        CANCELLED:{
            label:'Cancelled',
            className:'status-cancelled'
        },
        EXPIRED:{
            label:'Expired',
            className:'status-expired'
        },
    }
    const current=config[normalized]||{
        label:status||'Unknown',
        className:'status-default',
    }
    return (
         <span
            className={`session-status ${current.className}`}
        >
            <span className="status-dot" />

            {current.label}
        </span>
    )
}

export default SessionStatusBadge