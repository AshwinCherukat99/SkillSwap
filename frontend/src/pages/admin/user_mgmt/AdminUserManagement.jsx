import React,{useEffect,useState,useCallback} from "react";
import { useNavigate } from "react-router-dom";

import UserStats from "../../../components/admin/user_mgmt/UserStats";
import UserFilters from "../../../components/admin/user_mgmt/UserFilters";
import UserTable from "../../../components/admin/user_mgmt/UserTable";
import ConfirmUserActionModal from "../../../components/admin/user_mgmt/ConfirmUserActionModal";
import EditUserModal from "../edit_user_modal/EditUserModal";

import './AdminUserManagement.css'

import adminApi from '../../../services/adminApi'

const AdminUserManagement=()=>{
    const navigate=useNavigate()
    const [users,setUsers]=useState([])
    const [stats,setStats]=useState({
        total_users:0,
        active_users:0,
        suspended_users:0,
        blocked_users:0,
    })
    const [search,setSearch]=useState('')
    const [selectedStatus,setSelectedStatus]=useState('ALL')
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [actionModal,setActionModal]=useState({
        show:false,
        type:null,
        user:null,
    })
    const [actionLoading,setActionLoading]=useState(false)
    const [editingUser,setEditingUser]=useState(null)
    const fetchUsers=useCallback(
        async ()=>{
            try{
                setLoading(true)
                setError('')
                const response=await adminApi.get(
                    '/admin/users/',
                    {
                        params:{
                            search,
                            status:selectedStatus,
                        }
                    }
                )
                setUsers(response.data.users||[])
                setStats(response.data.stats||{
                    total_users:0,
                    active_users:0,
                    blocked_users:0,
                    suspended_users:0,
                })
            }catch(error){
                console.error('failed to fetch users:',error)
                setError(error.response?.data?.detail||'failed to load users')
            }finally{
                setLoading(false)
            }
        },
    [search,selectedStatus])
    useEffect(()=>{
        fetchUsers()
    },[fetchUsers])
    const handleSearchChange=(value)=>{
        setSearch(value)
    }
    const handleStatusChange=(value)=>{
        setSelectedStatus(value)
    }
    const handleView=(user)=>{
        console.log('view user:',user.id)
        navigate(`/admin/user-management/${user.id}/`)
    }
    const handleEdit=(user)=>{
        setEditingUser(user)
    }
    const openActionModal=(type,user)=>{
        setActionModal({
            show:true,
            type,
            user,
        })
    }
    const executeAction=async ()=>{
        const {type,user}=actionModal
        if (!user){
            return
        }
        try{
            setActionLoading(true)
            let response
            if (type==='block'){
                response=await adminApi.post(
                    `/admin/users/${user.id}/block/`
                )
            }
            if (type==='suspend'){
                response=await adminApi.post(
                    `/admin/users/${user.id}/suspend/`
                )
            }
            if (type==='activate'){
                response=await adminApi.post(
                    `/admin/users/${user.id}/activate/`
                )
            }
            console.log(response?.data)
            setActionModal({
                show:false,
                type:null,
                user:null,
            })
            await fetchUsers()
        }catch(error){
            console.error('user action failed:',error)
            setError(error.response?.data?.detail||error.response?.data?.error||'user action failed')
        }finally{
            setActionLoading(false)
        }
    }
    const getModalContent=()=>{
        const {type,user}=actionModal
        if (!user){
            return {}
        }
        const name=user.full_name||user.username||'this user'
        const content={
            block:{
                title:'Block User',
                message:`Are you sure you want to block ${name}? They will no longer be able to access the platform`,
                confirmText:'Block User',
                confirmClass:'btn-danger',
            },
            suspend:{
                title:'Suspend User',
                message:`Are you sure you want to suspend ${name}? They will still be able to login but restricted actions will be unavailable`,
                confirmText:'Suspend User',
                confirmClass:'btn-warning',
            },
            activate:{
                title:'Activate User',
                message:`Are you sure you want to activate ${name}?`,
                confirmText:'Activate User',
                confirmClass:'btn-primary'
            }
        }
        return content[type]||{}
    }
    const modalContent=getModalContent()
    return(
        <div className="admin-user-management">

            {/* Header */}

            <div className="mb-4">

                <h2 className="fw-bold mb-1">
                    User Management
                </h2>

                <p className="text-muted mb-0">
                    Monitor, verify, and moderate
                    the SkillSwap community.
                </p>

            </div>


            {/* Error */}

            {error && (

                <div
                    className="alert alert-danger d-flex justify-content-between align-items-center"
                    role="alert"
                >

                    <span>
                        {error}
                    </span>

                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={fetchUsers}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* Statistics */}

            <UserStats
                stats={stats}
            />


            {/* Filters */}

            <UserFilters
                search={search}
                setSearch={
                    handleSearchChange
                }
                selectedStatus={
                    selectedStatus
                }
                setSelectedStatus={
                    handleStatusChange
                }
            />


            {/* Table */}

            <UserTable
                users={users}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}

                onBlock={(user) =>
                    openActionModal(
                        'block',
                        user
                    )
                }

                onSuspend={(user) =>
                    openActionModal(
                        'suspend',
                        user
                    )
                }

                onActivate={(user) =>
                    openActionModal(
                        'activate',
                        user
                    )
                }

            />


            {/* Confirmation */}

            <ConfirmUserActionModal
                show={
                    actionModal.show
                }
                title={
                    modalContent.title
                }
                message={
                    modalContent.message
                }
                confirmText={
                    modalContent.confirmText
                }
                confirmClass={
                    modalContent.confirmClass
                }
                loading={
                    actionLoading
                }
                onConfirm={
                    executeAction
                }
                onCancel={() =>
                    setActionModal({
                        show: false,
                        type: null,
                        user: null,
                    })
                }
            />

            {editingUser&&(
                <EditUserModal
                user={editingUser}
                onClose={()=>setEditingUser(null)}
                onUpdated={async ()=>{
                    setEditingUser(null)
                    await fetchUsers()
                }}/>
            )}

        </div>
    )
}

export default AdminUserManagement