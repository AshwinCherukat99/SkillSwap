import { useCallback,useEffect,useState,useMemo } from "react";

import api from '../../../services/api'

import CreateStoryModal from "../../../components/user/stories/CreateStoryModal";
import StorySearch from "../../../components/user/stories/StorySearch";
import StoryCarousel from "../../../components/user/stories/StoryCarousel";
import StoryViewer from "../../../components/user/stories/StoryViewer";
import MyStoryPanel from "../../../components/user/stories/MyStoryPanel";
import './StoriesPage.css'

const StoriesPage=()=>{
    const [stories,setStories]=useState([])
    const [myStories,setMyStories]=useState([])
    const [selectedStory,setSelectedStory]=useState(null)
    const [search,setSearch]=useState('')
    const [showCreateModal,setShowCreateModal]=useState(false)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const fetchStories=useCallback(async ()=>{
        try{
            setLoading(true)
            setError('')
            const [feedResponse,myResponse]=await Promise.all([
                api.get('/stories/'),
                api.get('/stories/me/')
            ])
            const feed=Array.isArray(feedResponse.data)?feedResponse.data:feedResponse.data.results||[]
            const ownStories=Array.isArray(myResponse.data)?myResponse.data:myResponse.data.results||[]
            setStories(feed)
            setMyStories(ownStories)
            setSelectedStory((current)=>{
                if (!current) return null
                const updated=[...feed,...ownStories].find(
                    (story)=>story.id===current.id
                )
                return updated||null
            })
        }catch(err){
            console.error('failed to fetch stories:',err)
            setError(err.response?.data?.detail||'unable to load stories. please try again')
        }finally{
            setLoading(false)
        }
    },[])
    useEffect(()=>{
        fetchStories()
    },[fetchStories])
    const groupedStories=useMemo(()=>{
        const groups=new Map()
        stories.forEach((story)=>{
            const userId=story.user
            if (!groups.has(userId)){
                groups.set(userId,{
                    userId,
                    username:story.username,
                    fullName:story.full_name,
                    profileImage:story.profile_image,
                    stories:[]
                })
            }
            groups.get(userId).stories.push(story)
        })
        return Array.from(groups.values())
    },[stories])
    const filteredGroups=useMemo(()=>{
        const query=search.trim().toLowerCase()
        if (!query) return groupedStories
        return groupedStories.filter((group)=>{
            const matchesUser=
            group.username?.toLowerCase().includes(query)||
            group.fullName?.toLowerCase().includes(query)
            const matchesStory=
            group.stories.some((story)=>
            story.text?.toLowerCase().includes(query))
            return matchesUser||matchesStory
        })
    },[groupedStories,search])
    const openStory=async (story)=>{
        setSelectedStory(story)
        try{
            await api.post(`/stories/${story.id}/view/`)
        }catch(err){
            console.error('unable to record story view:',err)
        }
    }
    const handleStoryCreated=async ()=>{
        setShowCreateModal(false)
        await fetchStories()
    }
    const handleStoryDeleted=async (storyId)=>{
        try{
            await api.delete(`/stories/${storyId}/`)
            setMyStories((previous)=>
            previous.filter((story)=>story.id!==storyId))
            setSelectedStory((current)=>
            current?.id===storyId?null:current)
            await fetchStories()
        }catch(err){
            console.error('unable to delete story:',err)
            alert(err.response?.data?.detail||'unable to delete story')
        }
    } 
    return (
        <div className="stories-page container-fluid">

            {/* Search section - not a navbar */}
            <StorySearch
                search={search}
                setSearch={setSearch}
            />

            {/* Page heading */}
            <section className="stories-heading d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">

                <div>
                    <div className="stories-eyebrow">
                        <span className="stories-live-dot"></span>
                        COMMUNITY PULSE
                        <span className="mx-2">•</span>
                        LIVE MOMENTS
                    </div>

                    <h1>Stories</h1>

                    <p>
                        Share moments, celebrate technical milestones,
                        and discover what your community is learning.
                    </p>
                </div>

                <button
                    className="btn btn-primary stories-add-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    <span className="material-symbols-outlined">
                        add
                    </span>
                    Add Story
                    <span className="stories-new-badge">NEW</span>
                </button>

            </section>

            {/* Story filters - Mentors filter removed */}
            <div className="stories-filter-row">
                <span className="stories-filter active">
                    <span className="material-symbols-outlined">
                        all_inclusive
                    </span>
                    All Stories
                    <span className="stories-filter-count">
                        {stories.length + myStories.length}
                    </span>
                </span>

                <span className="stories-filter">
                    <span className="material-symbols-outlined">
                        group
                    </span>
                    Community
                </span>
            </div>

            {/* Story circles */}
            <StoryCarousel
                myStories={myStories}
                groups={filteredGroups}
                onAddStory={() => setShowCreateModal(true)}
                onOpenStory={openStory}
            />

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" />
                    <p className="mt-3 text-secondary">
                        Loading stories...
                    </p>
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                    <button
                        className="btn btn-sm btn-outline-danger ms-3"
                        onClick={fetchStories}
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="row g-4 stories-main-layout">

                    {/* Story viewer */}
                    <div className="col-12 col-lg-7 d-flex flex-column align-items-center">

                        {selectedStory ? (
                            <StoryViewer
                                story={selectedStory}
                                onClose={() => setSelectedStory(null)}
                                onNext={() => {
                                    const currentIndex = stories.findIndex(
                                        (item) => item.id === selectedStory.id
                                    );

                                    const next = stories[currentIndex + 1];

                                    if (next) openStory(next);
                                }}
                                onPrevious={() => {
                                    const currentIndex = stories.findIndex(
                                        (item) => item.id === selectedStory.id
                                    );

                                    const previous = stories[currentIndex - 1];

                                    if (previous) openStory(previous);
                                }}
                                onDeleted={handleStoryDeleted}
                            />
                        ) : (
                            <div className="stories-empty-viewer">
                                <span className="material-symbols-outlined">
                                    auto_stories
                                </span>
                                <h5>Select a story</h5>
                                <p>
                                    Choose a story above to start viewing.
                                </p>
                            </div>
                        )}

                        <div className="stories-keyboard-help">
                            <span><kbd>SPACE</kbd> Pause</span>
                            <span><kbd>←</kbd> Previous</span>
                            <span><kbd>→</kbd> Next</span>
                        </div>
                    </div>

                    {/* My story insights */}
                    <div className="col-12 col-lg-5">
                        <MyStoryPanel
                            myStories={myStories}
                            onOpenStory={openStory}
                            onDeleteStory={handleStoryDeleted}
                        />
                    </div>

                </div>
            )}

            {/* Create story modal */}
            {showCreateModal && (
                <CreateStoryModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={handleStoryCreated}
                />
            )}

        </div>
    )
}

export default StoriesPage