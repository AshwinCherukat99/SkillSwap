export const formatCurrency=(value)=>
    new Intl.NumberFormat('en-IN',{
        style:'currency',
        currency:'INR',
        maximumFractionDigits:2,
    }).format(Number(value||0))

export const formatDate=(value)=>{
    if (!value) return '-'
    const date=new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return date.toLocaleDateString('en-IN',{
        day:'2-digit',
        month:'short',
        year:'numeric',
    })
}

export const getStatusLabel=(status)=>
({
    REQUESTED:'Pending',
    APPROVED:'Approved',
    PROCESSING:'Processing',
    COMPLETED:'Completed',
    REJECTED:'Rejected',
})[status]||status||'unknown'

export const getStatusClass=(status)=>
({
    REQUESTED:'payout-status-pending',
    APPROVED:'payout-status-approved',
    PROCESSING:'payout-status-processing',
    COMPLETED: "payout-status-completed",
    REJECTED: "payout-status-rejected",
})[status]||'payout-status-unknown'