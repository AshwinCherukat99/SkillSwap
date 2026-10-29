import React from "react";

import {
    Download,
    FileText,
    Plus,
    ChevronDown,
} from 'lucide-react'

const SessionHistoryHeader=()=>{
    return (
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4 mb-4">

            <div>

                <div className="d-flex align-items-center gap-2 mb-2">

                    <span className="session-eyebrow">
                        Sessions Ledger
                    </span>

                    <span className="session-dot" />

                    <span className="session-sync">
                        Real-time Synced
                    </span>

                </div>

                <h1 className="session-page-title">
                    Session History
                </h1>

                <p className="session-page-description mb-0">
                    View and manage your completed,
                    cancelled and expired past mentoring exchanges.
                </p>

            </div>

        </div>
    )
}

export default SessionHistoryHeader