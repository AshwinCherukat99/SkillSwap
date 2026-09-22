import React from 'react'

const MentorStudentsHeader=({search,setSearch,selectedCourse,setSelectedCourse,selectedStatus,setSelectedStatus,courses})=>{
    return (
        <div className="students-header">
      <div className="mb-4">
        <h1 className="fw-bold mb-1">My Students</h1>
        <p className="text-muted mb-0">
          Manage and track the progress of students enrolled in your courses.
        </p>
      </div>

      <div className="row g-3 align-items-end">
        {/* Search - Student Name Only */}
        <div className="col-md-5">
          <label className="form-label fw-semibold">
            Search Students
          </label>

          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Course Filter */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">
            Course
          </label>

          <select
            className="form-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="all">All Courses</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">
            Status
          </label>

          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Students</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Reset */}
        <div className="col-md-1">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            title="Reset filters"
            onClick={() => {
              setSearch("");
              setSelectedCourse("all");
              setSelectedStatus("all");
            }}
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </div>
    </div>
    )
}

export default MentorStudentsHeader