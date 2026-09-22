import {useNavigate} from 'react-router-dom'

function NotificationCard({notification,onMarkAsRead}){
    const navigate=useNavigate()
    const getIcon=()=>{
        const type=notification.notification_type
        if (type.includes('SESSION')){
            return 'schedule'
        } 
        if (type.includes('MESSAGE')){
            return 'chat'
        }
        if (type.includes('RATING')){
            return 'star'
        } 
        if (type.includes('FRIEND')){
            return 'group'
        }
        if (type.includes('STREAK')){
            return 'local-fire-department'
        }
        if (type.includes('PAYMENT')){
            return 'payments'
        }
        if (type.includes('ADMIN')){
            return 'campaign'
        }
        if (type.includes('WELCOME')){
            return 'waving_hand'
        }
        return 'notifications'
    }
    const getCategory=()=>{
        const type=notification.notification_type
        if (type.includes('MESSAGE')){
            return 'Messages'
        }
        if (type.includes('SESSION')){
            return 'Sessions'
        }
        if (type.includes('REVIEW')){
            return 'Reviews'
        } 
        if (type.includes('STREAK')||type.includes('WELCOME')){
            return 'Achievements'
        }
        if (type.includes('FRIEND')){
            return 'Skill Requests'
        }
        return 'Other'
    }
    const formatDate=(dateString)=>{
        const date=new Date(dateString)
        const now=new Date()
        const difference=now-date
        const minutes=Math.floor(
            difference/60000
        ) 
        if (minutes<1){
            return 'just now'
        }
        if (minutes<60){
            return `${minutes} min ago`
        }
        const hours=Math.floor(
            minutes/60
        )
        if (hours<24){
            return `${hours} hour${hours>1?'s':''} ago`
        }
        const days=Math.floor(hours/24)
        if (days==1){
            return 'yesterday'
        } 
        return `${days} days ago`
    }
    const handleClick=async ()=>{
        if (!notification.is_read){
            await onMarkAsRead(notification.id)
        }
        if (notification.action_url){
            navigate(notification.action_url)
        }
    }
    return (
        <div
            className={`
                notification-card
                ${
                    !notification.is_read
                        ? "notification-unread"
                        : ""
                }
            `}
            onClick={handleClick}
        >

            <div className="notification-icon">

                <span className="material-symbols-outlined">
                    {getIcon()}
                </span>

            </div>


            <div className="notification-content">

                <div className="notification-header">

                    <h5>
                        {notification.title}
                    </h5>

                    <small>
                        {formatDate(
                            notification.created_at
                        )}
                    </small>

                </div>


                <p>
                    {notification.message}
                </p>


                {!notification.is_read && (
                    <span className="unread-dot" />
                )}

            </div>

        </div>
    )
}

export default NotificationCard