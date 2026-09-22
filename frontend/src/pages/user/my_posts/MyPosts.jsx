import {useEffect,useState,useMemo} from 'react'
import {useNavigate} from 'react-router-dom'

import api from '../../../services/api'

import PostCard from '../../../components/user/posts/PostCard'
import CreatePostModal from '../../../components/user/posts/CreatePostModal'

import './MyPosts.css'

function MyPosts(){
    const navigate=useNavigate()
    const [posts,setPosts]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const [searchQuery,setSearchQuery]=useState("")
    const [showCreateModal,setShowCreateModal]=useState(false)
    const loadPosts=async ()=>{
        try{
            setLoading(true)
            setError("")
            const response=await api.get('posts/my_posts')
            const data=response.data
            setPosts(
                Array.isArray(data)?data:data.results||[]
            )
        }catch(err){
            console.error(
                'posts loading error:',
                err.response?.data||
                err
            )
            if (err.response?.status===401){
                navigate('/login/')
                return 
            }
            setError(
                err.response?.data?.detail||
                err.response?.data?.error||
                'unable to load your posts'
            )
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        loadPosts()
    },[])
    const filteredPosts=useMemo(()=>{
        const query=searchQuery.toLowerCase().trim()
        if (!query){
            return posts
        }
        return posts.filter(
            (post)=>{
                post.content?.toLowerCase().includes(query)
            }
        )
    },[posts,searchQuery])
    const postsWithImages=posts.filter(
        (post)=>post.image
    ).length
    const postsCreatedToday=posts.filter(
        (post)=>{
            const postDate=new Date(post.created_at).toDateString()
            const today=new Date().toDateString()
            return (postDate===today)
        }
    ).length
    const recentlyUpdated=posts.filter(
        (post)=>{
            if (!post.updated_at){
                return false
            }
            const updated=new Date(post.updated_at)
            const now=new Date()
            const difference=now-updated
            const oneWeek=7*24*60*60*1000
            return (difference<=oneWeek)
        }
    ).length
    const handlePostCreated=(newPost)=>{
        setPosts((currentPosts)=>[
            newPost,
            ...currentPosts,
        ])
    }
    const handleDelete=async (postId)=>{
        const confirmed=window.confirm(
            'are you sure you want to delete this post?'
        )
        if (!confirmed){
            return
        }
        try{
            await api.delete(`/posts/${postId}/`)
            setPosts((currentPosts)=>
            currentPosts.filter(
                (post)=>post.id!==postId
            ))
        }catch(err){
            console.error('delete post error:',
                err.response?.data||
                err
            )
            alert(
                err.response?.data?.detail||
                err.response?.data?.error||
                'unable to delete post'
            )
        }
    }
    return (
        <div className="my-posts-page">


            {/* ======================================
                HEADER
            ====================================== */}

            <div className="my-posts-header">

                <div>

                    <h1>
                        My Posts
                    </h1>

                    <p>
                        Manage and share your
                        knowledge with the SkillSwap
                        community.
                    </p>

                </div>


                <button
                    className="btn add-post-btn"
                    onClick={() =>
                        setShowCreateModal(
                            true
                        )
                    }
                >

                    <span className="material-symbols-outlined">
                        add
                    </span>

                    Add Post

                </button>

            </div>



            {/* ======================================
                SEARCH
            ====================================== */}

            <div className="post-search-wrapper">

                <span className="material-symbols-outlined">
                    search
                </span>


                <input
                    type="text"
                    className="form-control"
                    placeholder="Search your posts..."
                    value={searchQuery}
                    onChange={
                        (event) =>
                            setSearchQuery(
                                event.target.value
                            )
                    }
                />

            </div>



            {/* ======================================
                STATS
            ====================================== */}

            <div className="row g-4 post-stats-row">


                <div className="col-6 col-lg-3">

                    <div className="post-stat-card">

                        <span className="material-symbols-outlined stat-icon">
                            article
                        </span>

                        <p>
                            Total Posts
                        </p>

                        <h3>
                            {posts.length}
                        </h3>

                    </div>

                </div>



                <div className="col-6 col-lg-3">

                    <div className="post-stat-card">

                        <span className="material-symbols-outlined stat-icon">
                            image
                        </span>

                        <p>
                            Posts With Images
                        </p>

                        <h3>
                            {postsWithImages}
                        </h3>

                    </div>

                </div>



                <div className="col-6 col-lg-3">

                    <div className="post-stat-card">

                        <span className="material-symbols-outlined stat-icon">
                            today
                        </span>

                        <p>
                            Created Today
                        </p>

                        <h3>
                            {postsCreatedToday}
                        </h3>

                    </div>

                </div>



                <div className="col-6 col-lg-3">

                    <div className="post-stat-card">

                        <span className="material-symbols-outlined stat-icon">
                            update
                        </span>

                        <p>
                            Updated This Week
                        </p>

                        <h3>
                            {recentlyUpdated}
                        </h3>

                    </div>

                </div>

            </div>



            {/* ======================================
                ERROR
            ====================================== */}

            {error && (

                <div className="alert alert-danger">

                    {error}

                </div>

            )}



            {/* ======================================
                LOADING
            ====================================== */}

            {loading && (

                <div className="posts-loading">

                    <div
                        className="
                            spinner-border
                            text-primary
                        "
                    />

                    <p>
                        Loading your posts...
                    </p>

                </div>

            )}



            {/* ======================================
                POSTS
            ====================================== */}

            {!loading && (

                <div className="posts-section">


                    <div className="posts-section-header">

                        <div>

                            <h2>
                                Your Posts
                            </h2>

                            <p>
                                {filteredPosts.length}
                                {" "}
                                post
                                {filteredPosts.length !== 1
                                    ? "s"
                                    : ""
                                }
                            </p>

                        </div>

                    </div>



                    {filteredPosts.length === 0 ? (

                        <div className="empty-posts">

                            <span className="material-symbols-outlined">
                                article
                            </span>


                            <h4>

                                {searchQuery
                                    ? "No posts found"
                                    : "No posts yet"
                                }

                            </h4>


                            <p>

                                {searchQuery
                                    ? "Try a different search."
                                    : "Share your first post with the SkillSwap community."
                                }

                            </p>


                            {!searchQuery && (

                                <button
                                    className="
                                        btn
                                        add-post-btn
                                    "
                                    onClick={() =>
                                        setShowCreateModal(
                                            true
                                        )
                                    }
                                >

                                    Create Your First Post

                                </button>

                            )}

                        </div>

                    ) : (

                        <div className="posts-list">

                            {filteredPosts.map(

                                (post) => (

                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onDelete={
                                            handleDelete
                                        }
                                    />

                                )

                            )}

                        </div>

                    )}

                </div>

            )}



            {/* ======================================
                CREATE POST MODAL
            ====================================== */}

            {showCreateModal && (

                <CreatePostModal
                    onClose={() =>
                        setShowCreateModal(
                            false
                        )
                    }
                    onPostCreated={
                        handlePostCreated
                    }
                />

            )}


        </div>
    )
}

export default MyPosts