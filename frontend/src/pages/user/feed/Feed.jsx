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
    const [trendingSkills,setTrendingSkills]=useState([])
    const [suggestedMentors,setSuggestedMentors]=useState([])
    const [loadingSidebar,setLoadingSidebar]=useState(true)
    const [editingPost,setEditingPost]=useState(null)
    const [posts,setPosts]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    useEffect(() => {
    console.log("Trending skills state:", trendingSkills);
    console.log("Suggested mentors state:", suggestedMentors);
    console.log("Sidebar loading:", loadingSidebar);
}, [trendingSkills, suggestedMentors, loadingSidebar]);
    const profileImage = user?.profile_image
    ? user.profile_image.startsWith("http")
        ? user.profile_image
        : `${BACKEND_ORIGIN}${user.profile_image}`
    : "/default-avatar.png";
    const fetchSidebarData=async ()=>{
      try{
        console.log('fetching sidebar data')
        const response=await api.get(
          '/posts/feed/sidebar/'
        )
        console.log('sidebar api response:',response.data)
        setTrendingSkills(response.data.trending_skills||[])
        setSuggestedMentors(response.data.suggested_mentors||[])
      }catch(err){
        console.error("Sidebar API failed:", err);
        console.error("Response status:", err.response?.status);
        console.error("Response data:", err.response?.data);
      }finally{
        setLoadingSidebar(false)
      }
    }
    const handleMessageMentor = async (mentor) => {
    try {
        const response = await api.post(
            '/chat/conversations/mentor/',
            {
                mentor_id: mentor.id,
            }
        );

        navigate(
            `/direct-chat?conversation=${response.data.id}`
        );

    } catch (err) {
        console.error(
            'failed to open mentor conversation:',
            err
        );

        alert(
            err.response?.data?.detail ||
            'unable to open conversation'
        );
    }
};
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
        fetchSidebarData()
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
  <div className="container feed-container py-4">
    <div className="row g-4">
      {/* LEFT SIDEBAR */}
      <div className="col-12 col-md-5 col-lg-3">
        <div className="sticky-sidebar">
          {/* Profile Card */}
          <div className="card surface-card shadow-sm border-0 mb-3 overflow-hidden text-center">
  <div className="profile-banner">
    <img
      src={profileImage}
      alt=""
      className="profile-banner-img"
    />
  </div>
  <div className="card-body px-3 pb-3 pt-3">
    <h6 className="fw-bold mb-0">
      {user?.full_name || user?.username || "User"}
    </h6>
    <p className="text-muted small mb-3">@{user?.username}</p>

              {/* Stats Box */}
              <div className="stats-box d-flex py-2 mb-3">
                <div className="col-6 stats-divider">
                  <div className="fw-bold text-dark">
                    ⭐ {user?.average_rating ?? "0.0"}
                  </div>
                  <small className="text-muted fs-xs">Rating</small>
                </div>
                <div className="col-6">
                  <div className="fw-bold text-dark">
                    🔥 {user?.current_streak ?? 0}
                  </div>
                  <small className="text-muted fs-xs">Streak</small>
                </div>
              </div>

              <Link
                to="/profile/"
                className="btn btn-outline-primary btn-sm w-100 rounded-pill fw-semibold"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="card surface-card shadow-sm border-0 d-none d-lg-block">
            <div className="list-group list-group-flush rounded-3">
              <Link to="/upcoming_sessions" className="sidebar-link">
                <span className="material-symbols-outlined fs-5">event</span>
                <span>Sessions</span>
              </Link>
              <Link to="/my_skills" className="sidebar-link">
                <span className="material-symbols-outlined fs-5">school</span>
                <span>My Skills</span>
              </Link>
              <Link to="/chat" className="sidebar-link">
                <span className="material-symbols-outlined fs-5">forum</span>
                <span>Group Chats</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FEED */}
      <div className="col-12 col-md-8 col-lg-6">
        <CreatePost onPostCreated={handlePostCreated} />

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2 small">Loading your feed...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger d-flex align-items-center justify-content-between">
            <span>{error}</span>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={fetchPosts}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="card surface-card shadow-sm border-0 text-center py-5">
            <span className="material-symbols-outlined fs-1 text-muted">
              feed
            </span>
            <h6 className="mt-3 fw-bold">No posts yet</h6>
            <p className="text-muted small mb-0">
              Be the first to share something with the SkillSwap community.
            </p>
          </div>
        )}

        {!loading &&
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={user}
              onEdit={handlePostEdit}
              onDelete={handlePostDeleted}
            />
          ))}

        {editingPost && (
          <EditPost
            post={editingPost}
            onClose={() => setEditingPost(null)}
            onUpdated={handlePostUpdated}
          />
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="col-lg-3 d-none d-lg-block">
        <div className="sticky-sidebar">
          {/* Trending Topics / Skills */}
          
<div className="card surface-card shadow-sm border-0 mb-3 p-3">

    <h6 className="widget-title mb-3">
        Trending Skills
    </h6>

    <div className="d-flex flex-wrap gap-2">

        {loadingSidebar ? (
            <small className="text-muted">
                Loading trending skills...
            </small>
        ) : trendingSkills.length > 0 ? (

            trendingSkills.map((skill) => (
                <span
                    key={skill.id}
                    className="trending-skill"
                    title={`${skill.selection_count} users selected this skill`}
                >
                    #{skill.name.replace(/\s+/g, '')}
                </span>
            ))

        ) : (
            <small className="text-muted">
                No trending skills available.
            </small>
        )}

    </div>

</div>

          {/* Suggested Mentors / Users */}
          
<div className="card surface-card shadow-sm border-0 p-3">

    <h6 className="widget-title mb-3">
        Suggested Mentors
    </h6>

    {loadingSidebar ? (

        <p className="text-muted small">
            Loading mentors...
        </p>

    ) : suggestedMentors.length > 0 ? (

        suggestedMentors.map((mentor) => (

            <div
                key={mentor.id}
                className="d-flex align-items-center justify-content-between mb-3"
            >

                {/* Mentor information */}
                <div className="d-flex align-items-center gap-2">

                    {mentor.profile_image ? (

                        <img
                            src={mentor.profile_image}
                            alt={mentor.full_name}
                            className="rounded-circle border"
                            style={{
                                width: "42px",
                                height: "42px",
                                objectFit: "cover",
                                flexShrink: 0
                            }}
                            onError={(e) => {
                                e.currentTarget.src =
                                    "/default-avatar.png";
                            }}
                        />

                    ) : (

                        <div className="avatar-placeholder rounded-circle bg-light border p-2">
                            <span className="material-symbols-outlined fs-5 text-muted">
                                person
                            </span>
                        </div>

                    )}

                    <div style={{ minWidth: 0 }}>

                        <p className="mb-0 fw-semibold fs-sm">
                            {mentor.full_name}
                        </p>

                        <small className="text-muted fs-xs">
                            {mentor.current_profession ||
                                "Mentor"}
                        </small>

                    </div>

                </div>

                {/* Connect button */}
                <button
                    type="button"
                    className="follow-btn"
                    onClick={() => handleMessageMentor(mentor)}
                >
                    Connect
                </button>

            </div>

        ))

    ) : (

        <p className="text-muted small mb-0">
            No suggested mentors available.
        </p>

    )}

</div>

        </div>
      </div>
    </div>
  </div>
);
}

export default Feed