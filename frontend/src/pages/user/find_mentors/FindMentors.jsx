import React,{useEffect,useState,useMemo} from 'react'
import api from '../../../services/api'       

import MentorHero from '../../../components/user/find_mentors/MentorHero'
import MentorFilters from '../../../components/user/find_mentors/MentorFilters'
import MentorCard from '../../../components/user/find_mentors/MentorCard'
import TopRatedMentors from '../../../components/user/find_mentors/TopRatedMentors'
import MentorSearch from '../../../components/user/find_mentors/MentorSearch'

import './FindMentors.css'

function FindMentors(){
    const [mentors,setMentors]=useState([]) 
    const [search,setSearch]=useState("")
    const [courses,setCourses]=useState([])
    const [filters,setFilters]=useState({
        experience:"",
        rating:0,
        course:"",
        qualification:"",
    })
    const [loading,setLoading]=useState(true) 
    const [error,setError]=useState("") 
    useEffect(()=>{
        const fetchMentors=async ()=>{
            try{
                setLoading(true)
                setError("")
                const response=await api.get('/auth/find_mentors/')
                setMentors(
                    response.data.mentors||
                    response.data.results||
                    response.data||
                    []
                )
            }catch(error){
                console.error(
                    'failed to fetch mentors',
                    error
                )
                setError(
                    error.response?.data?.detail||
                    error.response?.data?.error||
                    'unable to load mentors'
                )
            }finally{
                setLoading(false)
            }
        }
        fetchMentors()
    },[])
    useEffect(() => {

    const fetchCourses = async () => {

        try {

            const response = await api.get("/courses/");

            setCourses(
                response.data.courses ||
                response.data.results ||
                response.data ||
                []
            );

        } catch (error) {

            console.error(
                "Failed to fetch courses:",
                error
            );

        }
    };

    fetchCourses();

}, []);
    const handleFilterChange=(name,value)=>{
        setFilters((previous)=>({
            ...previous,
            [name]:value,
        }))
    }
    const filteredMentors=useMemo(()=>{
        const normalizedSearch=search.trim().toLowerCase() 
        return mentors.filter((mentor)=>{
            if (normalizedSearch){
                const name=mentor.full_name?.toLowerCase()||""
                const username=mentor.username?.toLowerCase()||""
                const matchesSearch=name.includes(normalizedSearch)||username.includes(normalizedSearch)
                if (!matchesSearch){
                    return false
                }
            }
            if (filters.course){
                const selectedCourse=filters.course.toLowerCase()
                const mentorCourses=mentor.courses||[]
                const hasCourse = mentorCourses.some((course) => {

                const courseName =
                    typeof course === "string"
                        ? course
                        : course.name || "";

                return (
                    courseName.toLowerCase() ===
                    selectedCourse
                );

            });

            if (!hasCourse) {
                return false;
            }
        }


        // =====================================
        // EXPERIENCE FILTER
        // =====================================

        if (filters.experience) {

            const experience =
                Number(mentor.experience_years || 0);

            switch (filters.experience) {

                case "1-3":
                    if (
                        experience < 1 ||
                        experience > 3
                    ) {
                        return false;
                    }
                    break;

                case "3-5":
                    if (
                        experience < 3 ||
                        experience > 5
                    ) {
                        return false;
                    }
                    break;

                case "5-10":
                    if (
                        experience < 5 ||
                        experience > 10
                    ) {
                        return false;
                    }
                    break;

                case "10+":
                    if (experience < 10) {
                        return false;
                    }
                    break;

                default:
                    break;
            }
        }


        // =====================================
        // AVERAGE RATING
        // =====================================

        if (filters.rating) {

            const mentorRating =
                Number(mentor.rating || 0);

            if (
                mentorRating < Number(filters.rating)
            ) {
                return false;
            }
        }


        // =====================================
        // QUALIFICATION
        // =====================================

        if (filters.qualification) {

            const mentorQualification =
                mentor.qualification?.toLowerCase() || "";

            if (
                mentorQualification !==
                filters.qualification.toLowerCase()
            ) {
                return false;
            }

            }
            return true
        },[mentors,search,filters])
    })
    const clearFilters=()=>{
        setFilters({
            experience:"",
            rating:0,
            course:"",
            qualification:"",
        })
        setSearch("")
    }
    if (loading){
        return (
            <div className="container py-5">

                <div className="d-flex justify-content-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading mentors...
                        </span>
                    </div>

                </div>

            </div>
        )
    }
    return (
        <div className="find-mentors-page">

            <div className="container py-4">

                {/* =========================
                    HERO
                ========================= */}

                <MentorHero />


                {/* =========================
                    DISCOVERY
                ========================= */}

                <div
                    id="mentor-results"
                    className="row mt-5"
                >

                    {/* =====================
                        FILTERS
                    ===================== */}

                    <div className="col-lg-3 mb-4">

                        <MentorFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                            courses={courses}
                        />

                    </div>


                    {/* =====================
                        RESULTS
                    ===================== */}

                    <div className="col-lg-9">

                        {/* SEARCH */}

                        <MentorSearch
                            search={search}
                            onSearch={setSearch}
                        />


                        {/* ERROR */}

                        {error && (
                            <div className="alert alert-danger mt-4">
                                {error}
                            </div>
                        )}


                        {/* RESULTS HEADER */}

                        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">

                            <div>

                                <h3 className="mb-1">
                                    {filteredMentors.length}{" "}
                                    Verified Mentors Found
                                </h3>

                                <p className="text-muted mb-0">
                                    Find professionals who can
                                    help you develop your skills.
                                </p>

                            </div>

                        </div>


                        {/* =====================
                            MENTOR CARDS
                        ===================== */}

                        {filteredMentors.length > 0 ? (

                            <div className="row g-4">

                                {filteredMentors.map((mentor) => (

                                    <div
                                        className="col-md-6"
                                        key={mentor.id}
                                    >

                                        <MentorCard
                                            mentor={mentor}
                                        />

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="text-center py-5">

                                <i className="bi bi-person-x fs-1 text-muted"></i>

                                <h5 className="mt-3">
                                    No mentors found
                                </h5>

                                <p className="text-muted">
                                    Try changing your search or filters.
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </button>

                            </div>

                        )}


                        {/* =====================
                            RECENTLY ACTIVE
                        ===================== */}

                        <TopRatedMentors
                        mentors={mentors}
                        />

                    </div>

                </div>

            </div>

        </div>
    )
}

export default FindMentors