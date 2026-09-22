const ConversationItem=({
    group,
    active,
    onClick,
})=>{
    return (
        <button
            type="button"
            className={`conversation-item ${
                active ? 'active' : ''
            }`}
            onClick={onClick}
        >

            <div className="conversation-avatar">
                <i className="bi bi-people-fill"></i>
            </div>

            <div className="conversation-content">

                <div className="d-flex justify-content-between">

                    <span className="conversation-title text-truncate">
                        {group.course_title}
                    </span>

                    <small className="ms-2">
                        {group.member_count}
                    </small>

                </div>

                <div className="conversation-preview text-truncate">
                    {group.name}
                </div>

            </div>

        </button>
    )
}

export default ConversationItem