import {useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'

import adminApi from '../../../services/adminApi'

import PaymentOverviewCards from '../../../components/admin/payments_dashboard/PaymentOverviewCards'
import PaymentTabs from '../../../components/admin/payments_dashboard/PaymentTabs'
import RevenueGrowth from '../../../components/admin/payments_dashboard/RevenueGrowth'
import RecentTransactions from '../../../components/admin/payments_dashboard/RecentTransactions'
import PaymentQuickActions from '../../../components/admin/payments_dashboard/PaymentQuickActions'
import TodaySummary from '../../../components/admin/payments_dashboard/TodaySummary'
import FinancialHealth from '../../../components/admin/payments_dashboard/FinancialHealth'

import './AdminPaymentsDashboard.css'

function AdminPaymentsDashboard(){
    const navigate=useNavigate()
    const [dashboard,setDashboard]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    useEffect(()=>{
        const fetchDashboard=async ()=>{
            try{
                setLoading(true)
                setError('')
                const response=await adminApi.get(
                    '/payments/admin/dashboard/'
                )
                setDashboard(response.data)
            }catch(err){
                console.error('failed to load payment dashboard:',err)
                setError(err.response?.data?.detail||'unable to load payment dashboard')
            }finally{
                setLoading(false)
            }
        }
        fetchDashboard()
    },[])   
    const handleTabChange=(tab)=>{
        if (tab.key==='dashboard'){
            return
        }
        navigate(tab.path)
    }
    if (loading){
        return (
            <div className="container-fluid py-5">

                <div className="d-flex justify-content-center">

                    <div className="spinner-border text-primary"></div>

                </div>

            </div>
        )
    }
    if (error){
        return (
            <div className="container-fluid py-4">

                <div className="alert alert-danger">

                    <i className="bi bi-exclamation-circle me-2"></i>

                    {error}

                </div>

            </div>
        )
    }
    if (!dashboard){
        return null
    }
    return (
        <div className="admin-payments-dashboard">

            <div className="container-fluid px-4 py-4">


                {/* Page Header */}

                <div className="mb-4">

                    <h1 className="fw-bold mb-1">
                        Payments & Finance
                    </h1>

                    <p className="text-muted mb-0">
                        Manage revenue, payments, refunds,
                        mentor payouts, commissions,
                        and financial reporting.
                    </p>

                </div>


                {/* Overview */}

                <PaymentOverviewCards
                    overview={dashboard.overview}
                />


                {/* Tabs */}

                <div className="mt-4">

                    <PaymentTabs
                        activeTab="dashboard"
                        onTabChange={handleTabChange}
                    />

                </div>


                {/* Main layout */}

                <div className="row g-4 mt-1">


                    {/* Main column */}

                    <div className="col-12 col-xl-9">

                        <div className="d-flex flex-column gap-4">


                            {/* Revenue */}

                            <RevenueGrowth />


                            {/* Recent Transactions */}

                            <RecentTransactions
                                transactions={
                                    dashboard.transactions || []
                                }
                                onViewAll={() =>
                                    navigate(
                                        '/admin/payments/transactions'
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* Sidebar */}

                    <div className="col-12 col-xl-3">

                        <div className="d-flex flex-column gap-4">


                            {/* Quick Actions */}

                            <PaymentQuickActions

                                onGenerateReport={() =>
                                    navigate(
                                        '/admin/payments/reports'
                                    )
                                }

                                onApprovePayouts={() =>
                                    navigate(
                                        '/admin/payments/mentor-payouts'
                                    )
                                }

                                onReviewRefunds={() =>
                                    navigate(
                                        '/admin/payments/refunds'
                                    )
                                }

                            />


                            {/* Today */}

                            <TodaySummary
                                today={dashboard.today}
                            />


                            {/* Financial Health */}

                            <FinancialHealth
                                financialHealth={
                                    dashboard.financial_health
                                }
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default AdminPaymentsDashboard