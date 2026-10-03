import {useState} from 'react'

function RevenueGrowth(){
    const [period,setPeriod]=useState('7D')
    const periods=[
        '1D',
        '7D',
        '1M',
        '1Y',
    ]
    return (
        <div className="payment-panel revenue-growth-panel">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3 className="fw-semibold mb-0">
                    Revenue Growth Trends
                </h3>


                <div className="d-flex gap-2">

                    {periods.map((item) => (

                        <button
                            key={item}
                            type="button"
                            className={
                                period === item
                                    ? 'btn btn-sm btn-primary'
                                    : 'btn btn-sm btn-light'
                            }
                            onClick={() => setPeriod(item)}
                        >
                            {item}
                        </button>

                    ))}

                </div>

            </div>


            <div className="revenue-chart">

                <svg
                    viewBox="0 0 1000 200"
                    preserveAspectRatio="none"
                    className="w-100 h-100"
                >

                    <defs>

                        <linearGradient
                            id="chartGradient"
                            x1="0%"
                            x2="0%"
                            y1="0%"
                            y2="100%"
                        >

                            <stop
                                offset="0%"
                                stopColor="#4F46E5"
                                stopOpacity="1"
                            />

                            <stop
                                offset="100%"
                                stopColor="#4F46E5"
                                stopOpacity="0"
                            />

                        </linearGradient>

                    </defs>


                    <path
                        d="
                            M0,200
                            L0,150
                            Q100,100 200,160
                            T400,120
                            T600,180
                            T800,80
                            T1000,130
                            L1000,200
                            Z
                        "
                        fill="url(#chartGradient)"
                    />


                    <path
                        d="
                            M0,150
                            Q100,100 200,160
                            T400,120
                            T600,180
                            T800,80
                            T1000,130
                        "
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth="4"
                    />

                </svg>


                <div className="revenue-chart-overlay">

                    <p className="text-muted small text-uppercase mb-1">
                        Live Financial Stream
                    </p>

                    <p className="text-primary small fst-italic mb-0">
                        Interactive visualization processing...
                    </p>

                </div>

            </div>

        </div>
    )
}

export default RevenueGrowth