const ReviewStats=({
    stats={}
})=>{
    const growth=Number(stats.growth||0)
    const statsList=[
        {
            label:'Overall Rating',
            value:Number(stats.overall_rating||0).toFixed(2),    
            icon:'bi-star-fill',
            type:'primary',
        },
        {
            label:'Total Reviews',
            value:Number(stats.total_reviews||0).toLocaleString(),    
            icon:'bi-chat-square-text-fill',
            type:'primary',
        },
        {
            label:'Learners',
            value:Number(stats.learners||0).toLocaleString(),    
            icon:'bi-people-fill',
            type:'primary',
        },
        {
            label:'5-Star',
            value:Number(stats.five_star||0).toLocaleString(),    
            icon:'bi-star-fill',
            type:'secondary',
        },
        {
            label:'Growth',
            value:`${growth>=0?'+':'-'}${growth.toFixed(2)}`,    
            icon:growth>=0?'bi-graph-up-arrow':'bi-graph-down-arrow',
            type:'secondary',
        },
    ]
    return (
        <section className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3 mb-4">

            {statsList.map((stat) => (

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