import {useState,useEffect} from 'react'
import axios from 'axios'

import BadgeCard from '../../../components/user/badges/BadgeCard'
import BadgeFilters from '../../../components/user/badges/BadgeFilters'
import BadgeStats from '../../../components/user/badges/BadgeStats' 
import JourneyMilestones from '../../../components/user/badges/JourneyMilestones'

import './Badges.css'

import api from '../../../services/api'

function Badges(){
    const [badgeData,setBadgeData]=useState(null)
    const [activeFilter,setActiveFilter]=useState("all")
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    useEffect(()=>{
        const loadBadges=async ()=>{
            try{
                setLoading(true) 
                setError("")
                const accessToken=localStorage.getItem('access_token')
                const response=await api.get("/badges/")
                setBadgeData(response.data)
            }catch(err){
                console.error(
                    'Badge loading error:',err
                )
                setError(
                    err.reponse?.data?.detail||
                    'unable to load badges'
                )
            }finally{
                setLoading(false)
            }
        }
        loadBadges()
    },[])
    const badges=badgeData?.badges||[] 
    const filteredBadges=badges.filter((badge)=>{
        if (activeFilter==='earned'){
            return badge.earned===true
        }
        if (activeFilter==='locked'){
            return badge.earned===false
        }
        return true
    })
    if (loading){
        return (
            <div className="badges-page">

                <div className="text-center py-5">

                    <div
                        className="spinner-border"
                        role="status"
                    />

                    <p className="mt-3">
                        Loading achievements...
                    </p>

                </div>

            </div>
        )
    }
    if (error){
        return (
            <div className="badges-page">

                <div
                    className="
                        alert
                        alert-danger
                        text-center
                    "
                >

                    {error}

                </div>

            </div>
        )
    }
    return (
        <div className="badges-page">

            <div className="container py-4">


                {/* PAGE HEADER */}

                <div className="badges-header">

                    <div>

                        <h1>
                            Badges & Achievements
                        </h1>

                        <p>
                            Track your progress and celebrate
                            your SkillSwap journey.
                        </p>

                    </div>

                </div>


                {/* STATS */}

                <BadgeStats
                    stats={badgeData?.stats}
                />


                {/* BADGE COLLECTION */}

                <div className="badge-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Your Badge Collection
                            </h2>

                            <p>
                                Unlock badges by learning,
                                teaching, and participating
                                in SkillSwap.
                            </p>

                        </div>

                    </div>


                    <BadgeFilters
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                    />


                    <div className="row g-4">

                        {filteredBadges.map(
                            (badge) => (

                                <div
                                    className="
                                        col-lg-4
                                        col-md-6
                                    "
                                    key={badge.id}
                                >

                                    <BadgeCard
                                        badge={badge}
                                    />

                                </div>

                            )
                        )}

                    </div>


                    {filteredBadges.length === 0 && (

                        <div className="text-center py-5">

                            <p className="text-muted">

                                No badges found.

                            </p>

                        </div>

                    )}

                </div>


                {/* JOURNEY MILESTONES */}

                <JourneyMilestones
                    milestones={
                        badgeData?.milestones || []
                    }
                />


            </div>

        </div>
    )
}

export default Badges