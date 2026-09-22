import React,{useEffect,useState} from 'react'
import mentorApi from '../../../services/mentorApi'
import RevenueAnalytics from '../../../components/mentor/revenue_mgmt/RevenueAnalytics'
import RevenueStats from '../../../components/mentor/revenue_mgmt/RevenueState'
import RequestPayoutModal from '../../../components/mentor/revenue_mgmt/RequestPayoutModal'
import RecentTransactions from '../../../components/mentor/revenue_mgmt/RecentTransactions'
import RevenueHeader from '../../../components/mentor/revenue_mgmt/RevenueHeader'
import PayoutCard from '../../../components/mentor/revenue_mgmt/PayOutCard'
import EarningsByCourse from '../../../components/mentor/revenue_mgmt/EarningsByCours'

import './MentorRevenue.css'

const MentorRevenue=()=>{
    const [revenue,setRevenue]=useState(null) 
    const [loading,setLoading]=useState(true) 
    const [error,setError]=useState("")
    const [showPayoutModal,setShowPayoutModal]=useState(false)
    const fetchRevenue=async ()=>{
        try{
            setLoading(true)
            setError("")
            const response=await mentorApi.get(
                "/payments/mentor/revenue/"
            )
            setRevenue(response.data)
        }catch(err){
            console.error('failed to fetch mentor revenue:',err)
            setError(
                err.response?.data?.detail||'unable to load revenue information'
            )
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchRevenue()
    },[])
    const handleRequestPayout=()=>{
        setShowPayoutModal(true)
    }
    const handleClosePayoutModal=()=>{
        setShowPayoutModal(false)
    }    
    const handlePayoutRequested=()=>{
        setShowPayoutModal(false)
        fetchRevenue()
    }
    if (loading){
        return (
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-center align-items-center py-5">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>
                </div>
            </div>
        )
    }
    if (error){
        return (
            <div className="container-fluid py-4">
                <RevenueHeader />

                <div className="alert alert-danger mt-4" role="alert">
                    <div className="d-flex justify-content-between align-items-center">
                        <span>{error}</span>

                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={fetchRevenue}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    if (!revenue){
        return null
    }
    return (
        <div className="mentor-revenue-page container-fluid py-4">

            {/* Header */}
            <RevenueHeader />

            {/* Revenue Summary */}
            <RevenueStats
                summary={revenue.summary}
                wallet={revenue.wallet}
            />

            {/* Analytics + Payout */}
            <div className="row g-4 mt-1">

                <div className="col-12 col-xl-8">
                    <RevenueAnalytics
                        transactions={revenue.transactions || []}
                    />
                </div>

                <div className="col-12 col-xl-4">
                    <PayoutCard
                        wallet={revenue.wallet}
                        onRequestPayout={handleRequestPayout}
                    />
                </div>
            </div>

            {/* Earnings by Course */}
            <div className="mt-4">
                <EarningsByCourse
                    transactions={revenue.transactions || []}
                />
            </div>

            {/* Recent Transactions */}
            <div className="mt-4">
                <RecentTransactions
                    transactions={revenue.transactions || []}
                />
            </div>

            {/* Request Payout Modal */}
            <RequestPayoutModal
                show={showPayoutModal}
                onClose={handleClosePayoutModal}
                wallet={revenue.wallet}
                onPayoutRequested={handlePayoutRequested}
            />
        </div>
    )
}

export default MentorRevenue