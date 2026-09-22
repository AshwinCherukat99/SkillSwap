const MonthlyTrends=({
    trends=[],
    growth=0,
})=>{
    const values=trends.map(
        (item)=>Number(item.rating||0)
    )
    const maxValue=Math.max(
        ...values,
        5
    ) 
    return (
        <div className="glass-card review-card h-100 p-4">

            <div className="d-flex justify-content-between align-items-start">

                <h3 className="section-title mb-0">
                    Monthly Trends
                </h3>


                <span className="growth-badge">

                    <i className="bi bi-graph-up-arrow"></i>

                    {Number(growth) >= 0 ? "+" : ""}
                    {Number(growth).toFixed(1)}

                </span>

            </div>


            {trends.length > 0 ? (

                <>

                    <div className="trend-chart">

                        {trends.map((item, index) => {

                            const rating = Number(
                                item.rating || 0
                            );

                            const height =
                                (rating / maxValue) * 100;


                            return (
                                <div
                                    key={index}
                                    className="trend-column-wrapper"
                                >

                                    <div
                                        className="trend-column"
                                        style={{
                                            height: `${height}%`,
                                        }}
                                        title={`${item.month}: ${rating.toFixed(1)}`}
                                    ></div>

                                </div>
                            );
                        })}

                    </div>


                    <div className="trend-labels">

                        {trends.map((item, index) => (
                            <span key={index}>
                                {item.month}
                            </span>
                        ))}

                    </div>

                </>

            ) : (

                <div className="empty-trend">
                    No trend data available.
                </div>

            )}

        </div>
    )
}

export default MonthlyTrends