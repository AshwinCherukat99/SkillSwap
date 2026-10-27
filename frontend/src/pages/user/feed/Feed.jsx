import {useEffect,useState} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import { updateUser } from '../../../store/slices/authSlice'

import useRealtimeNotifications from '../../../hooks/useRealtimeNotifications'

import { BACKEND_ORIGIN } from '../../../config'

import {logout} from '../../../store/slices/authSlice'
import api from '../../../services/api'

import CreatePost from '../../../components/user/feed/CreatePost'
import PostCard from '../../../components/user/posts/PostCard'
import EditPost from '../../../components/user/feed/EditPost'

import './Feed.css'

function Feed(){
    useRealtimeNotifications('access_token')
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const user=useSelector(
        (state)=>state.auth.user
    )
    const [editingPost,setEditingPost]=useState(null)
    const [posts,setPosts]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const profileImage = user?.profile_image
    ? user.profile_image.startsWith("http")
        ? user.profile_image
        : `${BACKEND_ORIGIN}${user.profile_image}`
    : "/default-avatar.png";
    const handlePostEdit=(post)=>{
        setEditingPost(post)
    }
    const handlePostUpdated=(updatedPost)=>{
        setPosts((currentPosts)=>
        currentPosts.map((post)=>
        post.id===updatedPost.id?updatedPost:post))
    }
    useEffect(()=>{
        fetchPosts()
    },[])
    useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const response = await api.get("/auth/profile/");

            console.log("PROFILE RESPONSE:", response.data);

            dispatch(updateUser(response.data));
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    };

    fetchUserProfile();
}, [dispatch]);
    const fetchPosts=async ()=>{
        setLoading(true)
        setError("")
        try{
            const response=await api.get(
                '/posts/feed/'
            )
            setPosts(response.data)
        }catch(error){
            console.error(
                'error fetching feed:',
                error
            )
            setError(
                error?.response?.data?.detail||
                'failed to load feed'
            )
        }finally{
            setLoading(false)
        }
    }
    const handlePostCreated=(createdPost)=>{
        setPosts((currentPosts)=>[
            createdPost,
            ...currentPosts
        ])
    }
    const handlePostDeleted=(postId)=>{
        setPosts((currentPosts)=>
        currentPosts.filter(
            (post)=>post.id!==postId
        ))
};
    
    return (
        <div className="container-fluid py-4">

            <div className="row">

                {/* LEFT SIDEBAR */}

                <div className="col-lg-3 mb-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center">

                            <img
                                src={
                                    profileImage
                                }
                                alt=""
                                width="80"
                                height="80"
                                className="rounded-circle mb-3"
                                style={{
                                    objectFit: 'cover'
                                }}
                            />

                            <h5 className="mb-1">
                                {user?.full_name ||
                                    user?.username ||
                                    'User'}
                            </h5>

                            <p className="text-muted small mb-3">
                                @{user?.username}
                            </p>

                            <div className="row mb-3">

                <div className="col-6 border-end">
                    <div className="fw-bold">
                        ⭐ {user?.average_rating ?? "0.0"}
                    </div>

                    <small className="text-muted">
                        Rating
                    </small>
                </div>

                <div className="col-6">
                    <div className="fw-bold">
                        🔥 {user?.current_streak ?? 0}
                    </div>

                    <small className="text-muted">
                        Streak
                    </small>
                </div>

            </div>

                            <Link
                                to="/profile/"
                                className="btn btn-outline-primary btn-sm w-100"
                            >
                                View Profile
                            </Link>

                        </div>

                    </div>

                </div>


                {/* MAIN FEED */}

                <div className="col-lg-6">

                    <CreatePost
                        onPostCreated={
                            handlePostCreated
                        }
                    />

                    {loading && (
                        <div className="text-center py-5">

                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                            <p className="text-muted mt-2">
                                Loading your feed...
                            </p>

                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger">

                            {error}

                            <button
                                className="btn btn-sm btn-outline-danger ms-3"
                                onClick={fetchPosts}
                            >
                                Retry
                            </button>

                        </div>
                    )}

                    {!loading &&
                        !error &&
                        posts.length === 0 && (

                        <div className="card border-0 shadow-sm">

                            <div className="card-body text-center py-5">

                                <i
                                    className="bi bi-newspaper fs-1 text-muted"
                                ></i>

                                <h5 className="mt-3">
                                    No posts yet
                                </h5>

                                <p className="text-muted">
                                    Be the first to share
                                    something with the
                                    SkillSwap community.
                                </p>

                            </div>

                        </div>
                    )}

                    {!loading &&
                        posts.map((post) => (

                        <PostCard
                            key={post.id}
                            post={post}
                            currentUser={user}
                            onEdit={handlePostEdit}
                            onDelete={
                                handlePostDeleted
                            }
                        />

                    ))}

                    {editingPost&&(
                        <EditPost
                        post={editingPost}
                        onClose={()=>setEditingPost(null)}
                        onUpdated={handlePostUpdated}
                        />
                    )}

                </div>


                {/* RIGHT SIDEBAR */}

                <div className="col-lg-3">


                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <h6 className="fw-semibold">
                                SkillSwap
                            </h6>

                            <p className="text-muted small mb-0">
                                Learn, teach and connect
                                with people who share
                                your interests.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Feed