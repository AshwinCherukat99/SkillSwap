import {useCallback,useEffect,useState,useMemo} from 'react'

import adminApi from '../../../services/adminApi'

import PayoutStats from '../../../components/admin/mentor_payouts/PayoutStats'
import PayoutFilters from '../../../components/admin/mentor_payouts/PayoutFilters'
import PayoutTable from '../../../components/admin/mentor_payouts/PayoutTable'
import PayoutDetailsModal from '../../../components/admin/mentor_payouts/PayoutDetailsModal'
import RejectPayoutModal from '../../../components/admin/mentor_payouts/RejectPayoutModal'

import './MentorPayouts.css'

function MentorPayouts(){
    const [payouts,setPayouts]=useState([])
    const [stats,setStats]=useState({})
    const [loading,setLoading]=useState(true)
    const [actionLoading,setActionLoading]=useState(null)
    const [error,setError]=useState('')
    const [notice,setNotice]=useState('')
    const [search,setSearch]=useState('')
    const [status,setStatus]=useState('')
    const [amount,setAmount]=useState('')
    const [date,setDate]=useState('')
    const [selectedPayout,setSelectedPayout]=useState(null)
    const [detailsPayout,setDetailsPayout]=useState(null)
    const [rejectReason,setRejectReason]=useState('')
    const [approvalPayout,setApprovalPayout]=useState(null)
    const [approvalSuccess,setApprovalSuccess]=useState(false)
    const fetchPayouts=useCallback(async ()=>{
        setLoading(true)
        setError('')
        try{
            const params={}
            if (status) params.status=status
            if (amount) params.amount=amount
            if (date) params.date=date
            const response=await adminApi.get(
                '/payments/admin/payouts/',
                {
                    params
                }
            )
            setPayouts(response.data.payouts||[])
            setStats(response.data.stats||{})
        }catch(err){
            setError('unable to load mentor payout requests')
        }finally{
            setLoading(false)
        }
    },[status,amount,date])
    useEffect(()=>{
        fetchPayouts()
    },[fetchPayouts])
    const filteredPayouts=useMemo(()=>{
        const query=search.trim().toLowerCase()
        if (!query) return payouts
        return payouts.filter((payout)=>{
            const values=[
                payout.mentor_name,
                payout.payout_id,
                payout.id,
                payout.mentor_id,
            ]
            return values.some((value)=>
            String(value??'').toLowerCase().includes(query))
        })
    },[payouts,search])
    const resetFilters=()=>{
        setSearch('')
        setStatus('')
        setAmount('')
        setDate('')
    }
    const handleApprove=(payout)=>{
        setError('')
        setNotice('')
        setApprovalSuccess(false)
        setApprovalPayout(payout)
    }
    const confirmApproval=async ()=>{
        if (!approvalPayout) return 
        const payoutId=approvalPayout.id
        setActionLoading(payoutId)
        setError('')
        try{
            const response=await adminApi.post(
                `/payments/admin/payouts/${payoutId}/approve/`
            ) 
            setApprovalSuccess(true)
            await fetchPayouts()
            setNotice(response.data.message||'payout approved successfully')
        }catch(err){
            console.error(
                'payout approval failed:',err.response?.data||err
            )
            setError(
                err.response?.data?.detail||
                err.response?.data?.error||
                'unable to approve this payout'
            )
        }finally{
            setActionLoading(null)
        }
    }
    const closeApprovalModal=()=>{
        if (actionLoading!==null) return
        setApprovalPayout(null)
        setApprovalSuccess(false)
    }
    const openRejectModal=(payout)=>{
        setError('')
        setNotice('')
        setRejectReason('')
        setSelectedPayout(payout)
    }
    const closeRejectModal=()=>{
        if (actionLoading!==null) return
        setSelectedPayout(null)
        setRejectReason('')
    }
    const handleReject=async (event)=>{
        event.preventDefault()
        if (!selectedPayout||!rejectReason.trim()){
            setError('enter a reason for rejecting this payout')
            return
        }
        const payoutId=selectedPayout.id
        setActionLoading(payoutId)
        setError('')
        setNotice('')
        try{
            const response=await adminApi.post(
                `/payments/admin/payouts/${payoutId}/reject/`,{
                    reason:rejectReason.trim(),
                }
            )
            setNotice(response.data.message||'payout rejected successfully')
            setSelectedPayout(null)
            setRejectReason('')
            await fetchPayouts()
        }catch(err){
            setError('unable to reject this payout')
        }finally{
            setActionLoading(null)
        }
    }
    return (
        <div className="mentor-payout-page container-fluid py-4 px-3 px-lg-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Mentor Payouts</h2>
          <p className="text-secondary mb-0">
            Review and manage mentor payout requests.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={fetchPayouts}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setError("")}
          />
        </div>
      )}

      {notice && (
        <div className="alert alert-success alert-dismissible" role="status">
          {notice}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setNotice("")}
          />
        </div>
      )}

      <PayoutStats stats={stats} />

      <PayoutFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        amount={amount}
        onAmountChange={setAmount}
        date={date}
        onDateChange={setDate}
        onReset={resetFilters}
      />

      <PayoutTable
        payouts={filteredPayouts}
        loading={loading}
        actionLoading={actionLoading}
        onView={setDetailsPayout}
        onApprove={handleApprove}
        onReject={openRejectModal}
      />

      <PayoutDetailsModal
        payout={detailsPayout}
        onClose={() => setDetailsPayout(null)}
      />

      {approvalPayout && (
    <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">

                <div className="modal-header">
                    <h5 className="modal-title fw-bold">
                        {approvalSuccess
                            ? 'Payout Approved'
                            : 'Confirm Payout Approval'}
                    </h5>

                    <button
                        type="button"
                        className="btn-close"
                        onClick={closeApprovalModal}
                        disabled={actionLoading !== null}
                    />
                </div>

                <div className="modal-body text-center py-4">

                    {approvalSuccess ? (
                        <>
                            <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>

                            <h5 className="fw-bold">
                                Payout approved successfully!
                            </h5>

                            <p className="text-muted mb-0">
                                Payout #{approvalPayout.id} for Rs.{' '}
                                {approvalPayout.amount} has been approved.
                            </p>
                        </>
                    ) : (
                        <>
                            <i className="bi bi-exclamation-circle text-warning fs-1 mb-3 d-block"></i>

                            <p className="mb-2">
                                Are you sure you want to approve this payout?
                            </p>

                            <h4 className="fw-bold">
                                ₹{Number(approvalPayout.amount).toFixed(2)}
                            </h4>

                            <p className="text-muted small mb-0">
                                The amount will be deducted from the
                                mentor's pending payout balance.
                            </p>
                        </>
                    )}

                </div>

                <div className="modal-footer">

                    {approvalSuccess ? (
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={closeApprovalModal}
                        >
                            Done
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={closeApprovalModal}
                                disabled={actionLoading !== null}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={confirmApproval}
                                disabled={actionLoading !== null}
                            >
                                {actionLoading === approvalPayout.id ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Approving...
                                    </>
                                ) : (
                                    'Confirm Approval'
                                )}
                            </button>
                        </>
                    )}

                </div>
            </div>
        </div>
    </div>
)}

      <RejectPayoutModal
        payout={selectedPayout}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onSubmit={handleReject}
        onClose={closeRejectModal}
        submitting={
          selectedPayout !== null &&
          actionLoading === selectedPayout.id
        }
      />
    </div>
    )
}    

export default MentorPayouts