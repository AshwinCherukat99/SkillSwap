import React from 'react'
import {useNavigate} from 'react-router-dom'

const MentorCourseHeader=({searchTerm,setSearchTerm})=>{
    const navigate=useNavigate()
    const handleCreateCourse=()=>{
        navigate('/mentor/courses/create_course/')
    }
    const handleReport=()=>{
        alert('course report functionality will be added soon')
    }
    return (
        <>
            {/* Search bar */}
            <div className="mentor-course-topbar mb-4">
                <div className="mentor-course-search">
                    <span className="material-symbols-outlined">
                        search
                    </span>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search courses, modules, or students..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                </div>
            </div>

            {/* Page header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-5">

                <div>
                    <h1 className="mentor-course-title">
                        My Courses
                    </h1>

                    <p className="mentor-course-subtitle mb-0">
                        Manage your curriculum and monitor student
                        engagement across your workspace.
                    </p>
                </div>

                <div className="d-flex gap-2">

                    <button
                        className="btn mentor-report-btn"
                        onClick={handleReport}
                    >
                        <span className="material-symbols-outlined">
                            file_download
                        </span>

                        Report
                    </button>

                    <button
                        className="btn mentor-create-btn"
                        onClick={handleCreateCourse}
                    >
                        <span className="material-symbols-outlined">
                            add
                        </span>

                        Create Course
                    </button>

                </div>
            </div>
        </>
    )
}    

export default MentorCourseHeader