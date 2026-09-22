function PlatformStatus({status}){
    return (
        <div className="admin-panel">

            <div className="admin-panel-header">

                <h3>
                    Platform Status
                </h3>

            </div>

            <div className="platform-status-grid">

                <div>

                    <span>
                        Online
                    </span>

                    <strong>
                        {status?.online_users ?? 0}
                    </strong>

                    <div className="status-dots">
                        <i />
                        <i />
                        <i />
                    </div>

                </div>

                <div>

                    <span>
                        Sessions
                    </span>

                    <strong>
                        {status?.active_sessions ?? 0}
                    </strong>

                    <div className="status-dots primary-dots">
                        <i />
                        <i />
                        <i />
                    </div>

                </div>

            </div>

        </div>
    )
}

export default PlatformStatus