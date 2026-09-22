function CourseStats({course}){
    const formatLevel=(level)=>{
        if (!level){
            return ''
        }
        return level?.charAt(0).toUpperCase()+level?.slice(1).toLowerCase()
    }
    const formatDuration=(minutes)=>{
        if (!minutes){
            return
        }
        const hours=Math.floor(minutes/60)
        const mins=minutes%60
        if (hours===0){
            return `${mins} min`
        }
        if (mins===0){
            return `${hours} hr`
        }
        return `${hours} hr ${mins} min`
    }
    const mentor=course.mentor||{}
    const stats=[
        {
            icon:'bi-graph-up-arrow',
            label:'Level',
            value:formatLevel(course.level),
        },
        {
            icon:'bi-clock',
            label:'Estimated Duration',
            value:formatDuration(course.estimated_duration)
        },
        {
            icon:'bi-grid',
            label:'Category',
            value:course.category?.name||course.category||'-'
        },
        {
            icon:'bi-person-check',
            label:'Instructor',
            value:mentor.username?`@${mentor.username}`:'-'
        },
        {
            icon:'bi-currency-rupee',
            label:'Course Price',
            value:course.price==='0.00'||Number(course.price)===0?'Free':`Rs.${course.price}`
        }
    ]
    return (
        <section className="row g-3 mb-4">

            {stats.map((stat) => (
                <div
                    className="col-6 col-md-4 col-lg"
                    key={stat.label}
                >
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-3">

                            <div className="d-flex align-items-center gap-3">

                                <div className="course-stat-icon">
                                    <i
                                        className={`bi ${stat.icon}`}
                                    ></i>
                                </div>

                                <div className="min-w-0">

                                    <div className="small text-muted text-uppercase fw-semibold">
                                        {stat.label}
                                    </div>

                                    <div className="fw-bold text-dark text-truncate">
                                        {stat.value}
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            ))}

        </section>
    )
}

export default CourseStats