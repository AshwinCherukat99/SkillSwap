import React from 'react'

const EnrollmentPerformance=({data=[],})=>{
    const maxValue=data.length>0?Math.max(...data.map((item)=>item.enrollments),
1):1
    return (
        <div className="enrollment-performance-card">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                <h4 className="mb-0">
                    Enrollment Performance
                </h4>

                <select className="form-select form-select-sm enrollment-period-select">
                    <option>
                        Last 6 Months
                    </option>

                    <option>
                        Last Year
                    </option>
                </select>

            </div>

            {data.length === 0 ? (
                <div className="enrollment-empty-state">
                    <span className="material-symbols-outlined">
                        bar_chart
                    </span>

                    <p className="mb-0">
                        Enrollment history will appear here.
                    </p>
                </div>
            ) : (
                <div className="enrollment-chart">

                    {data.map((item) => {

                        const height =
                            (item.enrollments / maxValue) * 100;

                        return (
                            <div
                                className="enrollment-bar-column"
                                key={item.month}
                            >

                                <div className="enrollment-bar-container">

                                    <div
                                        className="enrollment-bar"
                                        style={{
                                            height: `${height}%`,
                                        }}
                                        title={`${item.enrollments} enrollments`}
                                    />

                                </div>

                                <span>
                                    {item.month}
                                </span>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    )
}

export default EnrollmentPerformance