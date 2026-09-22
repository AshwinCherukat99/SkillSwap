function StatusBadge({type,label}){
    return (
        <span className={`session-status ${type}`}>
            <span />
            {label}
        </span>
    )
} 

export default StatusBadge