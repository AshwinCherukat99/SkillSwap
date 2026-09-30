import React,{useEffect,useState} from "react";  
import {useParams,useNavigate} from 'react-router-dom'

import LessonLocked from "../../../components/user/lesson_page/LessonLocked";
import LessonHeader from "../../../components/user/lesson_page/LessonHeader";
import LessonContent from "../../../components/user/lesson_page/LessonContent";

import './LessonPage.css'

import api from "../../../services/api";

const LessonPage=()=>{
    const navigate=useNavigate()
    const {courseId,lessonId}=useParams()
    const [lesson,setLesson]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    useEffect(()=>{
        fetchLesson()
    },[courseId,lessonId])
    const fetchLesson=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await api.get(
                `/courses/${courseId}/lessons/${lessonId}/`
            )
            setLesson(response.data)
        }catch(error){
            console.error('failed to load lesson:',error)
            if (error.response?.status===403){
                setError(error.response?.data?.error||'this lesson is locked')
            }else{
                setError('failed to load lesson')
            }
        }finally{
            setLoading(false)
        }
    }
    if (loading){
        return (
            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="text-muted mt-3">
                    Loading lesson...
                </p>

            </div>
        )
    }
    if (error){
        return (
             <LessonLocked
                message={error}
                onBack={() => navigate(-1)}
            />
        )
    }
    if (!lesson){
        return null
    }
    return (
        <div className="lesson-page">

            <LessonHeader
                lesson={lesson}
                onBack={() => navigate(-1)}
            />


            <div className="container-fluid px-4 py-4">

                <div className="row g-4">

                    {/* Main content */}

                    <div className="col-lg-8">

                        <LessonContent
                            lesson={lesson}
                        />

                    </div>


                     </div>

            </div>

        </div>
    )
}

export default LessonPage