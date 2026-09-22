const ReviewStats=({
    mentor,
    summary,
    ratingDistribution
})=>{
    const stats=[
        {
            label:'Overall Rating',
            value:Number(mentor?.rating||0).toFixed(1),    
            icon:'bi-star-fill',
            type:'primary',
        },
        {
            label:'Total Reviews',
            value:Number(mentor?.total_reviews||0).toLocaleString(),    
            icon:'bi-chat-square-text-fill',
            type:'primary',
        },
        {
            label:'Learners',
            value:Number(summary?.learners||0).toLocaleString(),    
            icon:'bi-people-fill',
            type:'primary',
        },
        {
            label:'5-Star',
            value:Number(ratingDistribution?.['5']||0).toLocaleString(),    
            icon:'bi-star-fill',
            type:'secondary',
        },
        {
            label: "Recommend",
            value: `${Number(
                summary?.recommend_percentage || 0
            )}%`,
            icon: "bi-hand-thumbs-up-fill",
            type: "primary",
        },
        {
            label:'Growth',
            value:`${Number(summary?.growth||0)>=0?'+':''}${Number(summary?.growth || 0).toFixed(1)}`,    
            icon:'bi-graph-up-arrow',
            type:'secondary',
        },
    ]
    return (
        <section className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3 mb-4">

            {stats.map((stat) => (

                <div
                    className="col"
                    key={stat.label}
                >

                    <div className="glass-card review-stat-card">

                        <i
                            className={`bi ${stat.icon} stat-icon ${stat.type}`}
                        ></i>

                        <span className="stat-label">
                            {stat.label}
                        </span>

                        <span
                            className={`stat-value ${stat.type}`}
                        >
                            {stat.value}
                        </span>

                    </div>

                </div>

            ))}

        </section>
    )
}

export default ReviewStats