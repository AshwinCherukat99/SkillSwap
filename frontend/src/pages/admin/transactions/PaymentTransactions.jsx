import React,{useEffect,useState} from "react";

import adminApi from "../../../services/adminApi";

import TransactionStats from "../../../components/admin/transactions/TransactionStats";
import TransactionFilters from "../../../components/admin/transactions/TransactionFilters";
import TransactionTable from "../../../components/admin/transactions/TransactionTable";
import TransactionDetailsModal from "../../../components/admin/transactions/TransactionDetailsModal";

import './PaymentTransactions.css'

function PaymentTransactions(){
    const [stats,setStats]=useState({
        total_transactions:0,
        total_value:0,
        successful:0,
        failed:0,
        success_rate:0,
    })
    const [transactions,setTransactions]=useState([])
    const [filters,setFilters]=useState({
        search:'',
        type:'ALL',
        status:'ALL',
        date:'all',
    })
    const [appliedFilters,setAppliedFilters]=useState({
        search:'',
        type:'ALL',
        status:'ALL',
        date:'all',
    })
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [selectedTransaction,setSelectedTransaction]=useState(null)
    const fetchTransactions=async (currentFilters=appliedFilters)=>{
        try{
            setLoading(true)
            setError('')
            const params={}
            if (currentFilters.search.trim()){
                params.search=currentFilters.search.trim()
            }
            if (currentFilters.status!=='ALL'){
                params.status=currentFilters.status
            }
            if (currentFilters.date!=='all'){
                params.date=currentFilters.date
            }
            const response=await adminApi.get(
                '/payments/admin/transactions/',
                {params}
            )
            setStats(response.data.stats)
            setTransactions(response.data.transactions)
        }catch(err){
            console.error('failed to load transactions:',err)
            setError(err.response?.data?.detail||err.response?.data?.error||'unable to load transactions')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchTransactions()
    },[])
    const handleApply=()=>{
        setAppliedFilters(filters)
        fetchTransactions(filters)
    }
    const handleClear=()=>{
        const clearedFilters={
            search:'',
            type:'ALL',
            status:'ALL',
            date:'all',
        }
        setFilters(clearedFilters)
        setAppliedFilters(clearedFilters)
        fetchTransactions(clearedFilters)
    }
    const handleRefresh=()=>{
        fetchTransactions(appliedFilters)
    }
    return (
        <div className="payment-transactions-page">

            <div className="container-fluid px-3 px-lg-4 py-4">

                {/* Header */}

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">

                    <div>

                        <h1 className="fw-bold mb-1">
                            All Transactions
                        </h1>

                        <p className="text-muted mb-0">
                            View and manage all transactions
                            processed through SkillSwap.
                        </p>

                    </div>

                    <div className="d-flex gap-2">

                        <button
                            type="button"
                            className="btn btn-primary"
                        >
                            <i className="bi bi-download me-2"></i>
                            Export
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            Refresh
                        </button>

                    </div>

                </div>


                {/* Error */}

                {error && (

                    <div className="alert alert-danger d-flex align-items-center">

                        <i className="bi bi-exclamation-circle me-2"></i>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* Statistics */}

                <TransactionStats
                    stats={stats}
                />


                {/* Filters */}

                <TransactionFilters
                    filters={filters}
                    setFilters={setFilters}
                    onApply={handleApply}
                    onClear={handleClear}
                />


                {/* Table */}

                <TransactionTable
                    transactions={transactions}
                    loading={loading}
                    onViewDetails={
                        setSelectedTransaction
                    }
                />


            </div>


            {/* Details Modal */}

            <TransactionDetailsModal
                transaction={selectedTransaction}
                onClose={() =>
                    setSelectedTransaction(null)
                }
            />

        </div>
    )
}

export default PaymentTransactions