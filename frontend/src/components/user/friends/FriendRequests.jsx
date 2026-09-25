import React,{useEffect,useState} from 'react'

import api from '../../../services/api'

import FriendRequestCard from './FriendRequestCard'

const FriendRequests=()=>{
    const [requests,setRequests]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [processingId,setProcessingId]=useState(null)
    const fetchRequests=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await api.get(
                'auth/friends/requests/'
            )
            setRequests(response.data.requests||[])
        }catch(error){
            console.error('failed to fetch friend requests:',error)
            setError(error.response?.data?.detail||'failed to load friend requests')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchRequests()
    },[])        
    const handleAccept=async (requestId)=>{
        try{
            setProcessingId(requestId)
            await api.patch(
                `auth/friends/requests/${requestId}/accept/`
            )
            setRequests(previous=>
                previous.filter(request=>request.id!==requestId)
            )
        }catch(error){
            console.error('failed to accept friend request:',error)
        }finally{
            setProcessingId(null)
        }
    }
    const handleReject=async (requestId)=>{
        try{
            setProcessingId(requestId)
            await api.patch(
                `auth/friends/requests/${requestId}/reject/`
            )
            setRequests(previous=>
                previous.filter(request=>request.id!==requestId)
            )
        }catch(error){
            console.error('failed to reject friend request:',error)
        }finally{
            setProcessingId(null)
        }
    }
    if (loading){
        return (
            <div className="text-center py-4">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="text-muted mt-2 mb-0">
                    Loading friend requests...
                </p>

            </div>
        )
    }
    if (error){
        return (
            <div className="alert alert-danger">
                {error}
            </div>
        )
    }
    return (
        <div className="friend-requests">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <div>
                    <h5 className="fw-bold mb-1">
                        Friend Requests
                    </h5>

                    <p className="text-muted small mb-0">
                        People who want to connect with you
                    </p>
                </div>

                {requests.length > 0 && (
                    <span className="badge bg-primary">
                        {requests.length}
                    </span>
                )}

            </div>

            {requests.length === 0 ? (

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <i className="bi bi-person-plus fs-1 text-muted"></i>

                        <h6 className="fw-semibold mt-3">
                            No pending requests
                        </h6>

                        <p className="text-muted small mb-0">
                            You don't have any new friend requests.
                        </p>

                    </div>

                </div>

            ) : (

                <div>

                    {requests.map(request => (

                        <FriendRequestCard
                            key={request.id}
                            request={request}
                            onAccept={handleAccept}
                            onReject={handleReject}
                            processing={
                                processingId === request.id
                            }
                        />

                    ))}

                </div>

            )}

        </div>
    )
}

export default FriendRequests