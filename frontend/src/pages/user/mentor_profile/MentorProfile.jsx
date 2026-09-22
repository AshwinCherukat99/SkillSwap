import {useState,useEffect} from 'react'
import {useParams,useNavigate} from 'react-router-dom'

import api from '../../../services/api'

import MentorProfileHeader from '../../../components/user/mentor_profile/MentorProfileHeader'
import MentorSummary from '../../../components/user/mentor_profile/MentorSummary'
import TeachingNiche from '../../../components/user/mentor_profile/TeachingNiche'
import MentorCourses from '../../../components/user/mentor_profile/MentorCourses'
import MentorReviews from '../../../components/user/mentor_profile/MentorReviews'
import BookingCard from '../../../components/user/mentor_profile/BookingCard'
import ProfessionalOverview from '../../../components/user/mentor_profile/ProfessionlOverview'
import MentorActivity from '../../../components/user/mentor_profile/MentorActivity'

import './MentorProfile.css'

function MentorProfile(){
    const {mentorId}=useParams()
    const navigate=useNavigate()
    const [mentor,setMentor]=useState(null)
    const [courses,setCourses]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    useEffect(()=>{
        const fetchMentorProfile=async ()=>{
            try{
                const response=await api.get(
                    `/mentors/${mentorId}/profile/`
                )
                setMentor(response.data.mentor)
                setCourses(response.data.courses)
            }catch(error){
                console.error('failed to load mentor profile:',error)
                setError(error.response?.data?.detail||'unable to load mentor profile')
            }finally{
                setLoading(false)
            }
        }
        fetchMentorProfile()
    },[mentorId])
    if (loading){
        return (
            <div className="container py-5 text-center">
                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>

                <p className="mt-3 text-muted">
                    Loading mentor profile...
                </p>
            </div>
        )
    }
    if (error){
        return (
            <div className="container py-5">

                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>

            </div>
        )
    }
    if (!mentor){
        return (
            <div className="container py-5 text-center">
                <h4>Mentor not found</h4>
            </div>
        )
    }
    return (
        <div className="mentor-profile-page">

            {/* Breadcrumb */}

            <div className="container py-3">

                <button
                    className="btn btn-link text-decoration-none px-0"
                    onClick={() => navigate(-1)}
                >
                    <span className="material-symbols-outlined align-middle me-1">
                        arrow_back
                    </span>

                    Find Mentors
                </button>

            </div>


            {/* Profile Header */}

            <MentorProfileHeader
                mentor={mentor}
                onRequestSession={() => {
                    // session request will be connected here
                }}
            />


            {/* Main Content */}

            <div className="container mt-4">

                <div className="row g-4">

                    {/* LEFT */}

                    <div className="col-lg-8">

                        <div className="d-flex flex-column gap-4">

                            <MentorSummary
                                summary={
                                    mentor.professional_summary
                                }
                            />

                            <TeachingNiche
                                teachingNiche={
                                    mentor.teaching_niche
                                }
                            />

                            <MentorCourses
                                courses={courses}
                                mentor={mentor}
                            />

                            <MentorReviews
                                mentor={mentor}
                            />

                        </div>

                    </div>


                    {/* RIGHT */}

                    <div className="col-lg-4">

                        <div className="d-flex flex-column gap-4">

                            <BookingCard
                                mentor={mentor}
                            />

                            <ProfessionalOverview
                                mentor={mentor}
                            />

                            <MentorActivity
                                mentor={mentor}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default MentorProfile