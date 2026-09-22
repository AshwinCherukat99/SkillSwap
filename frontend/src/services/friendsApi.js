import api from './api'

const friendsApi={
    getFriends:(params={})=>{
        return api.get('/auth/friends/',{
            params
        })
    },
    sendSessionRequest:(data)=>{
        return api.post(
            '/sessions/session-requests/send/',
            data
        )
    },
    removeFriend:(userId)=>{
        return api.delete(
            `/friends/${userId}/`
        )
    },
}

export default friendsApi