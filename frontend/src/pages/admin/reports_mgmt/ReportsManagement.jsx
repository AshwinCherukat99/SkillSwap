import React,{useEffect,useState} from "react";

import adminApi from "../../../services/adminApi";

import ReportStats from "../../../components/admin/report_mgmt/ReportStats";
import ReportFilters from "../../../components/admin/report_mgmt/ReportFilters";
import ReportTabs from "../../../components/admin/report_mgmt/ReportTabs";
import ReportTable from "../../../components/admin/report_mgmt/ReportTable";
import ReportDetailModal from "../../../components/admin/report_mgmt/ReportDetailModal";

import './ReportsManagement.css'

function ReportsManagement(){
    const [stats,setStats]=useState([])
    const [reports,setReports]=useState([])
    const [loading,setLoading]=useState(false)
    const [selectedReport,setSelectedReport]=useState(null)
    const [search,setSearch]=useState('')
    const [reportType,setReportType]=useState('')
    const [priority,setPriority]=useState('')
    const [status,setStatus]=useState('')
    const [activeTab,setActiveTab]=useState('ALL')
    useEffect(()=>{
        fetchStats()
        fetchReports()
    },[])
    const fetchStats=async ()=>{
        try{
            const response=await adminApi.get(
                '/reports/admin/stats/'
            )
            setStats(response.data)
        }catch(err){
            console.error('failed to load report stats:',err)
        }
    }
    const fetchReports=async ()=>{
        try{
            setLoading(true)
            const params={}
            if (search)
                params.search=search
            if (reportType)
                params.report_type=reportType
            if (priority)
                params.priority=priority
            if (status)
                params.status=status
            if (activeTab==='USERS'){
                params.target_type='USER'
            }
            if (activeTab==='MESSAGES'){
                params.target_type='MESSAGE'
            }
            if (activeTab==='POSTS'){
                params.target_type='POST'
            }
            if (activeTab==='SESSIONS'){
                params.target_type='SESSION'
            }
            const response=await adminApi.get(
                '/reports/admin/'
            )
            setReports(response.data)
        }catch(err){
            console.error('failed to load reports:',err)
        }finally{
            setLoading(false)
        }
    }
    const handleUpdate=async (reportId,data)=>{
        try{
            await adminApi.patch(
                `/reports/admin/${reportId}/`,
                data
            )
            setSelectedReport(null)
            await fetchReports()
            await fetchStats()
        }catch(err){
            console.error('failed to update report:',err)
        }
    }
    const handleSuspend=async (userId)=>{
        if (!window.confirm('are you sure you want to suspend this user?')){
            return
        }
        try{
            await adminApi.post(
                `/admin/users/${userId}/suspend/`
            )
            alert('user suspended successfully')
            await fetchStats()
        }catch(err){
            console.error('failed to suspend user:',err)
        }
    }
    return (
        <div className="reports-page">

            <div className="container-fluid px-4 py-4">

                {/* HEADER */}

                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold mb-1">
                            Reports & Moderation
                        </h2>

                        <p className="text-muted mb-0">
                            Manage community safety,
                            review reports and handle
                            moderation cases.
                        </p>

                    </div>

                </div>


                {/* STATS */}

                <div className="mb-4">

                    <ReportStats
                        stats={stats}
                    />

                </div>


                {/* TABS */}

                <div className="mb-4">

                    <ReportTabs
                        activeTab={activeTab}
                        setActiveTab={(tab) => {

                            setActiveTab(tab)

                            setTimeout(
                                fetchReports,
                                0
                            )

                        }}
                    />

                </div>


                {/* FILTERS */}

                <div className="mb-4">

                    <ReportFilters
                        search={search}
                        setSearch={setSearch}

                        reportType={reportType}
                        setReportType={setReportType}

                        priority={priority}
                        setPriority={setPriority}

                        status={status}
                        setStatus={setStatus}

                        onSearch={fetchReports}
                    />

                </div>


                {/* REPORT TABLE */}

                <div className="card border-0 shadow-sm">

                    <div className="card-header bg-white border-0 p-4">

                        <h5 className="fw-bold mb-0">
                            Moderation Queue
                        </h5>

                    </div>

                    <ReportTable
                        reports={reports}
                        loading={loading}
                        onView={setSelectedReport}
                    />

                </div>

            </div>


            {selectedReport && (

                <ReportDetailModal
                    report={selectedReport}
                    onClose={() =>
                        setSelectedReport(null)
                    }
                    onUpdate={handleUpdate}
                    onSuspend={handleSuspend}
                />

            )}

        </div>
    )
}

export default ReportsManagement