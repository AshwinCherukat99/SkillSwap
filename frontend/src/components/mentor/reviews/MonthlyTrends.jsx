const MonthlyTrends=({
    trends=[],
    growth=0,
    months=6,
    setMonths
})=>{
    const values=trends.map(
        (item)=>Number(item.average_rating||0)
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

                    <i className={Number(growth)>=0?"bi bi-graph-up-arrow":"bi bi-graph-down-arrow"}/>

                    {Number(growth) >= 0 ? "+" : "-"}
                    {Number(growth).toFixed(2)}

                </span>

            </div>

            <select className="form-select form-select-sm mt-3"
            value={months}
            onChange={(e)=>setMonths(Number(e.target.value))}>
                <option value={6}>Last 6 months</option>
                <option value={12}>Last 12 months</option>
            </select>

            {trends.length > 0 ? (

                <>

                    <div className="trend-chart">

                        {trends.map((item, index) => {

                            const rating = Number(
                                item.average_rating || 0
                            );

                            const height =
                                (rating / maxValue) * 100;


                            return (
                                <div
                                    key={item.month}
                                    className="trend-column-wrapper"
                                >

                                    <div
                                        className="trend-column"
                                        style={{
                                            height: `${height}%`,
                                        }}
                                        title={`${item.month}: ${rating.toFixed(2)} (${item.total_reviews} reviews)`}
                                    ></div>

                                </div>
                            );
                        })}

                    </div>


                    <div className="trend-labels">

                        {trends.map((item) => (
                            <span key={item.month}>
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