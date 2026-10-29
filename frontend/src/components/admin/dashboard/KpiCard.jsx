function KpiCard({title,value,change,changeType,icon,iconClass,filledIcon=false}){
    return (
        <div className="kpi-card">

            <div className="kpi-top">

                <div className={`kpi-icon ${iconClass}`}>
                    <span
                        className="material-symbols-outlined"
                        style={
                            filledIcon
                                ? {
                                      fontVariationSettings:
                                          "'FILL' 1",
                                  }
                                : undefined
                        }
                    >
                        {icon}
                    </span>
                </div>

                {change && (
                    <span className={`kpi-change ${changeType}`}>
                        {change}
                    </span>
                )}

            </div>

            <div>
                <p>{title}</p>
                <h3>{value}</h3>
            </div>

            </div>
    )
}

export default KpiCard