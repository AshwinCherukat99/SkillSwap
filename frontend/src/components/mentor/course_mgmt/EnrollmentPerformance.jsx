import React,{useState} from 'react'

const EnrollmentPerformance=({data=[],months,setMonths})=>{
    const maxValue=data.length>0?Math.max(...data.map((item)=>item.enrollments),
1):1
    return (
        <div className="enrollment-performance-card">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                <h4 className="mb-0">
                    Enrollment Performance
                </h4>

                <select className="form-select form-select-sm enrollment-period-select"
                value={months}
                onChange={(e)=>Number(e.target.value)}>
                    <option value={6}>
                        Last 6 Months
                    </option>

                    <option value={12}>
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

                        const enrollmentHeight =
                            (item.enrollments / maxValue) * 100;
                        const completedHeight=
                        (item.completed/maxValue)*100

                        return (
                            <div
                                className="enrollment-bar-column"
                                key={item.month}
                            >

                                <div className="enrollment-bar-container">

                                    <div
                                        className="enrollment-bar"
                                        style={{
                                            height: `${enrollmentHeight}%`,
                                        }}
                                        title={`${item.enrollments} enrollments`}
                                    />

                                    <div
                                        className="completed-enrollment-bar"
                                        style={{
                                            height: `${completedHeight}%`,
                                        }}
                                        title={`${item.completed} enrollments`}
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

            <div className='enrollment-chart-legend mt-3'>
                <span>
                    <i className='legend-enrollments'></i>
                    Enrollments
                </span>
                <span>
                    <i className='legend-completed'></i>
                    Completed
                </span>
            </div>

        </div>
    )
}

export default EnrollmentPerformance