import { Navigate } from "react-router-dom";

const ProtectedVideoCallRoute=({children})=>{
    const userToken=localStorage.getItem('access_token')
    const mentorToken=localStorage.getItem('mentor_access_token')
    if (mentorToken){
        return children
    }
    if (userToken){
        return children
    }
    return <Navigate to='/login/' replace/>
}

export default ProtectedVideoCallRoute