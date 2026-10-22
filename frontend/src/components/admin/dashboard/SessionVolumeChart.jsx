import React from "react";

function SessionVolumeChart({ data = [] }) {

    if (!data.length) {
        return (
            <div className="session-volume-empty">
                <span className="material-symbols-outlined">
                    bar_chart
                </span>

                <p>No session data available</p>
            </div>
        );
    }

    const maxValue = Math.max(
        ...data.flatMap((item) => [
            item.mentoring || 0,
            item.networking || 0,
        ]),
        1
    );

    const chartHeight = 220;
    const chartWidth = 600;

    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 35;

    const innerWidth =
        chartWidth - paddingLeft - paddingRight;

    const innerHeight =
        chartHeight - paddingTop - paddingBottom;

    const getX = (index) => {
        if (data.length === 1) {
            return chartWidth / 2;
        }

        return (
            paddingLeft +
            (index / (data.length - 1)) * innerWidth
        );
    };

    const getY = (value) => {
        return (
            paddingTop +
            innerHeight -
            (value / maxValue) * innerHeight
        );
    };

    const mentoringPoints = data
        .map((item, index) => {
            return `${getX(index)},${getY(item.mentoring || 0)}`;
        })
        .join(" ");

    const networkingPoints = data
        .map((item, index) => {
            return `${getX(index)},${getY(item.networking || 0)}`;
        })
        .join(" ");

    return (
        <div className="session-volume-chart">

            <div className="session-volume-svg-wrapper">

                <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    preserveAspectRatio="none"
                    className="session-volume-svg"
                >

                    {/* Grid lines */}

                    <line
                        x1={paddingLeft}
                        y1={paddingTop}
                        x2={chartWidth - paddingRight}
                        y2={paddingTop}
                        className="chart-grid-line"
                    />

                    <line
                        x1={paddingLeft}
                        y1={paddingTop + innerHeight / 2}
                        x2={chartWidth - paddingRight}
                        y2={paddingTop + innerHeight / 2}
                        className="chart-grid-line"
                    />

                    <line
                        x1={paddingLeft}
                        y1={paddingTop + innerHeight}
                        x2={chartWidth - paddingRight}
                        y2={paddingTop + innerHeight}
                        className="chart-grid-line"
                    />

                    {/* Mentoring line */}

                    <polyline
                        points={mentoringPoints}
                        fill="none"
                        className="session-line mentoring-line"
                    />

                    {/* Workshops line */}

                    <polyline
                        points={networkingPoints}
                        fill="none"
                        className="session-line workshops-line"
                    />

                    {/* Mentoring points */}

                    {data.map((item, index) => (
                        <circle
                            key={`mentoring-${item.label}`}
                            cx={getX(index)}
                            cy={getY(item.mentoring || 0)}
                            r="4"
                            className="session-point mentoring-point"
                        >
                            <title>
                                {item.label}:{" "}
                                {item.mentoring || 0} mentoring
                            </title>
                        </circle>
                    ))}

                    {/* Workshop points */}

                    {data.map((item, index) => (
                        <circle
                            key={`workshops-${item.label}`}
                            cx={getX(index)}
                            cy={getY(item.networking || 0)}
                            r="4"
                            className="session-point workshops-point"
                        >
                            <title>
                                {item.label}:{" "}
                                {item.networking || 0} networking
                            </title>
                        </circle>
                    ))}

                </svg>

            </div>

            {/* X-axis labels */}

            <div className="session-chart-labels">
                {data.map((item) => (
                    <span key={item.label}>
                        {item.label}
                    </span>
                ))}
            </div>

        </div>
    );
}

export default SessionVolumeChart;