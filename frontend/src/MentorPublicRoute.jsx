import {Navigate} from 'react-router-dom'

function MentorPublicRoute({children}){
    const token=localStorage.getItem('mentor_access_token')          
    if (token){
        return (
            <Navigate
            to='/mentor/dashboard/'
            replace
            />
        )
    }
    return children
}

export default MentorPublicRoute