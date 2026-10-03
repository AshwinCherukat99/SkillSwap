import React from "react";

const ActivityHeatmap=({sessions=[]})=>{
    const cells=Array.from(
        {length:28},
        (_,index)=>{
            const intensity=sessions.length===0?0:Math.min(Math.floor((sessions.length/10)),5)
            return intensity
        }
    )
    const getClass=(value)=>{
        const classes=[
            'bg-light',
            'bg-primary-subtle',
            'bg-primary',
            'bg-primary',
            'bg-primary',
            'bg-primary',
        ]
        return classes[value]
    }
    return (
        <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-4">

                <h6 className="fw-bold mb-4">
                    Activity Heatmap
                </h6>

                <div
                    className="d-grid"
                    style={{
                        gridTemplateColumns:
                            "repeat(7, 1fr)",
                        gap: "4px"
                    }}
                >

                    {cells.map((value, index) => (

                        <div
                            key={index}
                            className={`rounded ${getClass(value)}`}
                            style={{
                                height: "12px"
                            }}
                        />

                    ))}

                </div>

                <div className="d-flex justify-content-between mt-3">

                    <small className="text-muted">
                        Mon
                    </small>

                    <small className="text-muted">
                        Sun
                    </small>

                </div>

            </div>

        </div>
    )
}

export default ActivityHeatmap