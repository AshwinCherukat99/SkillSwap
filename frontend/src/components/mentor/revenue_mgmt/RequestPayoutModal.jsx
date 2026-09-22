import React,{useEffect,useState} from 'react'

import mentorApi from '../../../services/mentorApi'

const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(value || 0));
};

const RequestPayoutModal=({
    show,
    onClose,
    wallet={},
    onPayoutRequested,
})=>{
    const [amount,setAmount]=useState("")
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const [success,setSuccess]=useState(false)
    const availableBalance=Number(
        wallet.available_balance||0
    )
    useEffect(()=>{
        if (show){
            setAmount("")
            setError("")
            setSuccess(false)
            setLoading(false)
        }
    },[show])
    if (!show){
        return null
    }
    const handleAmountChange=(event)=>{
        const value=event.target.value
        if (value===''){
            setAmount('')
            setError('')
            return
        }
        if (!/^\d*\.?\d{0,2}$/.test(value)) {
            return;
        }
        setAmount(value)
        setError('')
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        setError('')
        setSuccess(false)
        const payoutAmount=Number(amount)
        if (!amount||Number.isNaN(payoutAmount)){
            setError('please enter a valid payout amount')
            return
        }
        if (payoutAmount<=0){
            setError('payout amount must be greater than zero')     
            return
        }
        if (payoutAmount>availableBalance){
            setError(
                `you can request upto ${formatCurrency(availableBalance)}`
            )
            return
        }
        try{
            setLoading(true)
            await mentorApi.post(
                '/payments/mentor/payout/',
                {
                    amount:payoutAmount
                }
            )
            setSuccess(true)
            setTimeout(()=>{
                onPayoutRequested()
            },1200)
        }catch(err){
            console.error('payout request failed:',err)
            setError(err.response?.data?.detail||'unable to submit payout request')
        }finally{
            setLoading(false)
        }
    }
    const handleBackdropClick=(event)=>{
        if (event.target===event.currentTarget&&!loading){
            onClose()
        }
    }
    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onMouseDown={handleBackdropClick}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                role="document"
            >
                <div className="modal-content border-0 shadow">

                    {/* Header */}
                    <div className="modal-header">
                        <div>
                            <h5 className="modal-title fw-bold">
                                Request Payout
                            </h5>

                            <p className="text-secondary small mb-0 mt-1">
                                Submit a payout request for admin review.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={loading}
                        ></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">

                        {success ? (
                            <div className="text-center py-4">

                                <div className="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center p-3 mb-3">
                                    <i className="bi bi-check-lg fs-3"></i>
                                </div>

                                <h5 className="fw-bold">
                                    Payout Request Submitted
                                </h5>

                                <p className="text-secondary mb-0">
                                    Your request has been submitted
                                    successfully. An admin will review
                                    and process the payout manually.
                                </p>

                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>

                                {/* Available Balance */}
                                <div className="bg-light rounded-3 p-3 mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-secondary">
                                            Available Balance
                                        </span>

                                        <span className="fw-bold">
                                            {formatCurrency(
                                                availableBalance
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="payoutAmount"
                                        className="form-label fw-semibold"
                                    >
                                        Payout Amount
                                    </label>

                                    <div className="input-group">
                                        <span className="input-group-text">
                                            ₹
                                        </span>

                                        <input
                                            id="payoutAmount"
                                            type="text"
                                            inputMode="decimal"
                                            className={`form-control ${
                                                error
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            placeholder="Enter amount"
                                            value={amount}
                                            onChange={
                                                handleAmountChange
                                            }
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-text">
                                        Maximum available:{" "}
                                        {formatCurrency(
                                            availableBalance
                                        )}
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        <i className="bi bi-exclamation-circle me-2"></i>
                                        {error}
                                    </div>
                                )}

                                {/* Information */}
                                <div className="alert alert-info mb-0">
                                    <div className="d-flex align-items-start gap-2">
                                        <i className="bi bi-info-circle mt-1"></i>

                                        <div className="small">
                                            <strong>
                                                How payouts work
                                            </strong>

                                            <ul className="mb-0 mt-2 ps-3">
                                                <li>
                                                    Your requested amount
                                                    will be moved to
                                                    pending balance.
                                                </li>

                                                <li>
                                                    An admin will review
                                                    your request.
                                                </li>

                                                <li>
                                                    Approved payouts are
                                                    transferred manually.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        )}

                    </div>

                    {/* Footer */}
                    {!success && (
                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={
                                    loading ||
                                    availableBalance <= 0
                                }
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>

                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-send me-2"></i>
                                        Submit Request
                                    </>
                                )}
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default RequestPayoutModal