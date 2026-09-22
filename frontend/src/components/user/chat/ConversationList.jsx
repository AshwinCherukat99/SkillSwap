import React from "react";

import ConversationItem from './ConversationItem'

const ConversationList=({
    groups,
    selectedGroup,
    onSelectGroup,
    loading,
})=>{
    return (
        <aside className="chat-sidebar d-none d-lg-flex flex-column">

            <div className="chat-sidebar-header">

                <h4 className="fw-bold text-primary mb-1">
                    Conversations
                </h4>

                <p className="text-muted small mb-0">
                    Your learning communities
                </p>

            </div>


            <div className="chat-conversation-list">

                {loading && (
                    <div className="text-center py-4">

                        <div
                            className="spinner-border spinner-border-sm text-primary"
                            role="status"
                        />

                        <div className="small text-muted mt-2">
                            Loading groups...
                        </div>

                    </div>
                )}


                {!loading && groups.length === 0 && (
                    <div className="text-center px-4 py-5">

                        <i className="bi bi-people fs-1 text-muted"></i>

                        <p className="text-muted mt-3 mb-1">
                            No study groups yet
                        </p>

                        <small className="text-muted">
                            Enroll in a course to join its study group.
                        </small>

                    </div>
                )}


                {!loading && groups.map(group => (

                    <ConversationItem
                        key={group.id}
                        group={group}
                        active={
                            selectedGroup?.id === group.id
                        }
                        onClick={() =>
                            onSelectGroup(group)
                        }
                    />

                ))}

            </div>

        </aside>
    )
}

export default ConversationList