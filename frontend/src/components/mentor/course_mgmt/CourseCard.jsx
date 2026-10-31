import React from 'react'
import {useNavigate} from 'react-router-dom'

import {BACKEND_ORIGIN} from '../../../config'

const CourseCard=({course})=>{
    const navigate=useNavigate()
    const isPublished=course.status==='PUBLISHED'
    const handleOpenCourse=()=>{
        navigate(`/mentor/courses/${course.id}/`)
    }
    console.log('course:',course.title)
    console.log('thumbnail url:',course.thumbnail)
    return (
        <div
            className="course-management-card"
            onClick={handleOpenCourse}
        >

            {/* Thumbnail */}
            <div className="course-card-image-wrapper">

                {course.thumbnail ? (
                    <img
                        src={`${BACKEND_ORIGIN}${course.thumbnail}`}
                        alt={course.title}
                        className="course-card-image"
                        onError={(e)=>{
                            console.error('failed to load course image:',e.target.src)
                            e.target.style.display='none'
                        }}
                    />
                ) : (
                    <div className="course-card-placeholder">
                        <span className="material-symbols-outlined">
                            school
                        </span>
                    </div>
                )}

                {/* Status */}
                <span
                    className={`course-status-badge ${
                        isPublished
                            ? "published"
                            : "draft"
                    }`}
                >
                    <span className="material-symbols-outlined">
                        {isPublished
                            ? "verified"
                            : "edit_note"}
                    </span>

                    {course.status}
                </span>

            </div>

            {/* Content */}
            <div className="p-4">

                <div className="d-flex justify-content-between align-items-start mb-2">

                    <span className="course-category">
                        {course.category}
                    </span>

                    <span className="course-updated">
                        {formatUpdatedDate(course.updated_at)}
                    </span>

                </div>

                <h4 className="course-card-title">
                    {course.title}
                </h4>

                {/* Stats */}
                <div className="row g-0 course-card-stats">

                    <div className="col-4 text-center">
                        <span className="course-card-stat-label">
                            Enroll
                        </span>

                        <strong>
                            {course.enrollment_count}
                        </strong>
                    </div>

                    <div className="col-4 text-center border-start border-end">
                        <span className="course-card-stat-label">
                            Level
                        </span>

                        <strong>
                            {formatLevel(course.level)}
                        </strong>
                    </div>

                    <div className="col-4 text-center">
                        <span className="course-card-stat-label">
                            Lessons
                        </span>

                        <strong>
                            {course.lesson_count}
                        </strong>
                    </div>

                </div>

            </div>
        </div>
    )
}

const formatLevel=(level)=>{
    if (!level){
        return '--'
    }
    return level.charAt(0)+level.slice(1).toLowerCase()
}
const formatUpdatedDate=(dateString)=>{
    if (!dateString){
        return ""
    } 
    const date=new Date(dateString)
    if (Number.isNaN(date.getTime())){
        return ""
    }
    return `Updated ${date.toLocaleDateString(
        undefined,
        {
            day:'numeric',
            month:'short',
        }
    )}`
}

export default CourseCard