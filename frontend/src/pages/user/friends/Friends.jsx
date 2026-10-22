import React,{useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'

import friendsApi from '../../../services/friendsApi'         
import api from '../../../services/api'

import FriendStats from '../../../components/user/friends/FriendStats'
import FriendsToolbar from '../../../components/user/friends/FriendsToolbar'
import EmptyFriends from '../../../components/user/friends/EmptyFriends'
import FriendCard from '../../../components/user/friends/FriendCard'
import FriendRequests from '../../../components/user/friends/FriendRequests'
import RequestSessionModal from '../request_session/RequestSessionModal'

import './Friends.css'

const Friends=()=>{
    const navigate=useNavigate()
    const [showRequestModal,setShowRequestModal]=useState(false)
    const [selectedFriend,setSelectedFriend]=useState(null)
    const [friends,setFriends]=useState([])
    const [stats,setStats]=useState({
        total_friends:0,
        online_friends:0,
        sessions_together:0,
        new_this_month:0,
    })
    const [search,setSearch]=useState('')
    const [filter,setFilter]=useState('all')
    const [sort,setSort]=useState('name')
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const fetchFriends=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await friendsApi.getFriends({
                search:search||undefined,
                filter:filter!=='all'?filter:undefined,
                sort
            })
            setFriends(response.data.friends||[])
            setStats(
                response.data.stats||
                {
                    total_friends:0,
                    online_friends:0,
                    sessions_together:0,
                    new_this_month:0,
                }
            )
        }catch(error){
            console.error('failed to fetch error-',error)
            setError(error.response?.data?.detail||'failed to load friends')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchFriends()
    },[search,filter,sort])
    const handleProfile=(friend)=>{
        navigate(`/${friend.id}/profile/`)
    }
    const handleChat=async (friend)=>{
        try{
            const response=await api.post(
            '/chat/conversations/direct/',
            {
                user_id:friend.id
            }
        )
        const conversationId=response.data.id
        navigate(`/direct-chat/?conversation=${conversationId}`)
        }catch(err){
            console.error('failed to open conversation:',err)
            setError(err.response?.data?.detail||'unable to open conversation')
        }
    }
    const handleRequestSession=(friend)=>{
        setSelectedFriend(friend)
        setShowRequestModal(true)
    }
    const handleCloseRequestModal=()=>{
        setShowRequestModal(false)
        setSelectedFriend(null)
    }
    return (
        <div className="friends-page">

            {/* Page heading */}
            <div className="mb-4">

                <h2 className="fw-bold mb-1">
                    Friends
                </h2>

                <p className="text-muted mb-0">
                    Stay connected with your SkillSwap friends
                </p>

            </div>


            {/* Statistics */}
            <FriendStats stats={stats} />

            <div className="mb-5">
    <FriendRequests />
</div>

            <div className="row g-4">

                {/* Main column */}
                <div className="col-12 col-xl-9">

                    <FriendsToolbar
                        search={search}
                        setSearch={setSearch}
                        filter={filter}
                        setFilter={setFilter}
                        sort={sort}
                        setSort={setSort}
                    />

                    {loading ? (

                        <div className="text-center py-5">

                            <div
                                className="spinner-border text-primary"
                                role="status"
                            />

                            <p className="text-muted mt-3">
                                Loading friends...
                            </p>

                        </div>

                    ) : error ? (

                        <div className="alert alert-danger">
                            {error}
                        </div>

                    ) : friends.length === 0 ? (

                        <EmptyFriends />

                    ) : (

                        <div className="row g-4">

                            {friends.map((friend) => (

                                <div
                                    key={friend.id}
                                    className="col-12 col-md-6 col-xxl-4"
                                >

                                    <FriendCard
                                        friend={friend}
                                        onProfile={handleProfile}
                                        onChat={handleChat}
                                        onRequestSession={
                                            handleRequestSession
                                        }
                                    />

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

                <RequestSessionModal
                show={showRequestModal}
                onClose={handleCloseRequestModal}
                recipient={selectedFriend}
                skillWanted={selectedFriend?.skill_wanted}
                skillOffered={selectedFriend?.skill_offered}
                onSuccess={(data)=>{
                    console.log('session request sent successfully:',data)
                    handleCloseRequestModal()
                }}/>

        </div>
    )
}

export default Friends