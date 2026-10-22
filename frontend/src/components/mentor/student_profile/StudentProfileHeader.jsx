function formatDate(value){
    if (!value) return 'not available'
    const date=new Date(value)
    return Number.isNaN(date.getTime())?'not available':date.toLocaleDateString()
}

function StudentProfileHeader({
    student,
    enrollment,
}){
    const name=student.full_name||student.user_name||'Student'
    const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map((part)=>part[0]).join('').toUpperCase()
    return (
        <section className="card border-0 mentor-profile-card mb-4">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
          {student.profile_image ? (
            <img
              className="student-avatar"
              src={student.profile_image}
              alt={`${name}'s profile`}
            />
          ) : (
            <div className="student-avatar student-avatar-fallback">
              {initials || "S"}
            </div>
          )}

          <div className="flex-grow-1">
            <span className="badge text-bg-primary mb-2">
              Enrolled student
            </span>

            {enrollment.completed_at && (
              <span className="badge text-bg-success ms-2">
                Course completed
              </span>
            )}

            <h1 className="h3 fw-bold mt-2 mb-1">{name}</h1>

            <div className="text-secondary mb-3">
              @{student.username}
            </div>

            <p className="mb-0 student-bio">
              {student.bio ||
                "This student hasn't added a bio yet."}
            </p>
          </div>

          <div className="enrollment-date-box">
            <div className="small text-secondary">
              Enrolled on
            </div>
            <strong>{formatDate(enrollment.enrolled_at)}</strong>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row g-3">
          <InfoItem label="Email" value={student.email} />
          <InfoItem
            label="Phone number"
            value={student.phone_number}
          />
          <InfoItem
            label="Location"
            value={student.location}
          />
          <InfoItem
            label="Username"
            value={`@${student.username}`}
          />
        </div>
      </div>
    </section>
    )
}

function InfoItem({label,value}){
    return (
        <div className="col-12 col-sm-6 col-xl-3">
      <div className="student-info-item h-100">
        <div className="small text-secondary mb-1">
          {label}
        </div>

        <div className="fw-semibold text-break">
          {value || "Not provided"}
        </div>
      </div>
    </div>
    )
}

export default StudentProfileHeader