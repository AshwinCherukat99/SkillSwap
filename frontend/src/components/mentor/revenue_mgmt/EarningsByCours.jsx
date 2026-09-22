import React,{useMemo} from 'react'

const formatCurrency=(value)=>{
    return new Intl.NumberFormat('en-IN',{
        style:'currency',
        currency:'INR',
        maximumFractionDigits:2,
    }).format(Number(value||0))
}
const EarningsByCourse=({transactions=[]})=>{
    const courseData=useMemo(()=>{
        const grouped={}
        transactions.forEach((transaction)=>{
            const courseTitle=transaction.course_title||'unknown course'
            if (!grouped[courseTitle]){
                grouped[courseTitle]={
                    course_title:courseTitle,
                    earnings:0,
                    transactions:0,
                    platform_fees:0,
                }
            }
            grouped[courseTitle].earnings+=Number(transaction.mentor_amount||0)
            grouped[courseTitle].platform_fees+=Number(transaction.platform_fees||0)
            grouped[courseTitle].transactions+=1
        })
        return Object.values(grouped).sort(
            (a,b)=>b.earnings-a.earnings
        )
    },[transactions])
    return (
        <div className="card border-0 shadow-sm">

            <div className="card-body p-4">

                <div className="mb-4">
                    <h5 className="fw-bold mb-1">
                        Earnings by Course
                    </h5>

                    <p className="text-secondary small mb-0">
                        Course-wise earnings from recorded transactions.
                    </p>
                </div>

                {courseData.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-bar-chart fs-1 text-secondary"></i>

                        <p className="text-secondary mt-3 mb-0">
                            No course earnings available yet.
                        </p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">

                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Transactions</th>
                                    <th>Platform Fees</th>
                                    <th className="text-end">
                                        Your Earnings
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {courseData.map((course) => (
                                    <tr
                                        key={course.course_title}
                                    >
                                        <td>
                                            <div className="fw-semibold">
                                                {course.course_title}
                                            </div>
                                        </td>

                                        <td>
                                            {course.transactions}
                                        </td>

                                        <td>
                                            {formatCurrency(
                                                course.platform_fees
                                            )}
                                        </td>

                                        <td className="text-end fw-bold text-success">
                                            {formatCurrency(
                                                course.earnings
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>
        </div>
    )
}

export default EarningsByCourse