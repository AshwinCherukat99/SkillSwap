
import { useMemo } from "react";

function SessionVolumeChart({ data = [] }) {
    const chartData = useMemo(
        () =>
            data.map((item) => ({
                label: item.label,
                mentoring: Number(item.mentoring ?? 0),
                networking: Number(item.networking ?? 0),
            })),
        [data]
    );

    const maxValue = Math.max(
        1,
        ...chartData.flatMap((item) => [
            item.mentoring,
            item.networking,
        ])
    );

    const axisMax = Math.ceil(maxValue / 5) * 5 || 5;

    const mentoringTotal = chartData.reduce(
        (sum, item) => sum + item.mentoring,
        0
    );

    const networkingTotal = chartData.reduce(
        (sum, item) => sum + item.networking,
        0
    );

    if (!chartData.length) {
        return (
            <div className="session-volume-empty">
                <span className="material-symbols-outlined">
                    bar_chart
                </span>
                <p>No session data available</p>
            </div>
        );
    }

    return (
        <div className="session-volume-chart">
            <div className="session-volume-plot">
                <div className="session-volume-y-labels">
                    {[100, 75, 50, 25, 0].map((percentage) => (
                        <span key={percentage}>
                            {Math.round(axisMax * percentage / 100)}
                        </span>
                    ))}
                </div>

                <div className="session-volume-bars-area">
                    <div className="session-volume-grid-lines">
                        {[0, 25, 50, 75, 100].map((percentage) => (
                            <div
                                key={percentage}
                                className="session-volume-grid-line"
                                style={{ bottom: `${percentage}%` }}
                            />
                        ))}
                    </div>

                    <div className="session-volume-bars">
                        {chartData.map((item, index) => (
                            <div
                                className="session-volume-day"
                                key={`${item.label}-${index}`}
                            >
                                <div className="session-volume-bar-pair">
                                    <div
                                        className="session-volume-bar mentoring-bar"
                                        style={{
                                            height: `${(item.mentoring / axisMax) * 100}%`,
                                        }}
                                        title={`Mentoring: ${item.mentoring}`}
                                    >
                                        <span className="session-volume-tooltip">
                                            {item.mentoring}
                                        </span>
                                    </div>

                                    <div
                                        className="session-volume-bar networking-bar"
                                        style={{
                                            height: `${(item.networking / axisMax) * 100}%`,
                                        }}
                                        title={`Networking: ${item.networking}`}
                                    >
                                        <span className="session-volume-tooltip">
                                            {item.networking}
                                        </span>
                                    </div>
                                </div>

                                <span className="session-volume-day-label">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="session-volume-summary">
                <div className="session-summary-card">
                    <span>Total Sessions</span>
                    <strong>{mentoringTotal + networkingTotal}</strong>
                </div>

                <div className="session-summary-card mentoring-summary">
                    <span>Mentoring</span>
                    <strong>{mentoringTotal}</strong>
                </div>

                <div className="session-summary-card networking-summary">
                    <span>Networking</span>
                    <strong>{networkingTotal}</strong>
                </div>
            </div>
        </div>
    );
}

export default SessionVolumeChart;
