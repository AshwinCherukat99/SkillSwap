import React,{use, useMemo,useState} from "react";

function ScheduleNotificationList({notifications,onEdit,onDelete,onCancel}){
    const [search,setSearch]=useState('')
    const [statusFilter,setStatusFilter]=useState('ALL')
    const scheduledNotifications=useMemo(()=>{
        return notifications.filter((notification)=>{
            const matchesStatus=statusFilter==='ALL'||notification.status===statusFilter
            const searchText=search.toLowerCase().trim()
            const matchesSearch=!searchText||
            notification.title?.toLowerCase().includes(searchText)||
            notification.message?.toLowerCase().includes(searchText)||
            notification.audience_display?.toLowerCase().includes(searchText)||
            notification.recipient_username?.toLowerCase().includes(searchText)
            return (matchesStatus&&matchesSearch)
        })
    },[notifications,search,statusFilter])
    const getAudienceLabel=(notification)=>{
        if (notification.audience==='INDIVIDUAL'){
            return (notification.recipient_username||'individual user')
        }
        return notification.audience_display||notification.audience
    }
    const formatDate=(value)=>{
        if (!value){
            return '-'
        }
        const date=new Date(value)
        if (Number.isNaN(date.getTime())){
            return '-'
        }
        return date.toLocaleDateString(
            undefined,
            {
                dateStyle:'medium',
                timeStyle:'short'
            }
        )
    }
    const getStatusClass=(status)=>{
        switch(status){
            case 'SCHEDULED':
                return 'status-scheduled'
            case 'SENT':
                return 'status-sent'
            case 'CANCELLED':
                return 'status-cancelled'
            default:
                return 'status-default'
        }
    }
    const handleDelete=(notification)=>{
        const confirmed=window.confirm(
            `Delete "${notification.title}"?`
        )
        if (confirmed){
            onDelete(notification.id)
        }
    }
    return (
        <div className="notification-queue-card">

            <div className="notification-queue-header">

                <div>

                    <h4>
                        Scheduled Queue
                    </h4>

                    <p>
                        Manage upcoming notifications
                        and previously sent campaigns.
                    </p>

                </div>

                <div className="notification-queue-tools">

                    <div className="notification-search-small">

                        <span className="material-symbols-outlined">
                            search
                        </span>

                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <select
                        className="form-select form-select-sm"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All
                        </option>

                        <option value="SCHEDULED">
                            Scheduled
                        </option>

                        <option value="SENT">
                            Sent
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>

                    </select>

                </div>

            </div>

            <div className="table-responsive">

                <table className="table notification-table align-middle mb-0">

                    <thead>

                        <tr>

                            <th>
                                Subject
                            </th>

                            <th>
                                Audience
                            </th>

                            <th>
                                Release
                            </th>

                            <th>
                                Status
                            </th>

                            <th className="text-end">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {scheduledNotifications.length ===
                        0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center py-5"
                                >

                                    <span className="material-symbols-outlined notification-empty-icon">
                                        notifications_off
                                    </span>

                                    <p className="mb-0 mt-2">
                                        No notifications found.
                                    </p>

                                </td>

                            </tr>

                        ) : (

                            scheduledNotifications.map(
                                (notification) => (

                                    <tr
                                        key={
                                            notification.id
                                        }
                                    >

                                        <td>

                                            <div className="notification-subject">

                                                <strong>
                                                    {
                                                        notification.title
                                                    }
                                                </strong>

                                                <span>
                                                    {notification.message}
                                                </span>

                                            </div>

                                        </td>

                                        <td>
                                            <span className="notification-audience">
                                                {getAudienceLabel(
                                                    notification
                                                )}
                                            </span>
                                        </td>

                                        <td>

                                            {formatDate(
                                                notification.scheduled_at ||
                                                    notification.sent_at
                                            )}

                                        </td>

                                        <td>

                                            <span
                                                className={`notification-status ${getStatusClass(
                                                    notification.status
                                                )}`}
                                            >
                                                {
                                                    notification.status_display ||
                                                    notification.status
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            <div className="notification-row-actions">

                                                {notification.status ===
                                                    "SCHEDULED" && (

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Edit"
                                                        onClick={() =>
                                                            onEdit(
                                                                notification
                                                            )
                                                        }
                                                    >

                                                        <span className="material-symbols-outlined">
                                                            edit
                                                        </span>

                                                    </button>

                                                )}

                                                {notification.status ===
                                                    "SCHEDULED" && (

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-warning"
                                                        title="Cancel"
                                                        onClick={() =>
                                                            onCancel(
                                                                notification.id
                                                            )
                                                        }
                                                    >

                                                        <span className="material-symbols-outlined">
                                                            cancel
                                                        </span>

                                                    </button>

                                                )}

                                                {notification.status ===
                                                    "SCHEDULED" && (

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                notification
                                                            )
                                                        }
                                                    >

                                                        <span className="material-symbols-outlined">
                                                            delete
                                                        </span>

                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default ScheduleNotificationList