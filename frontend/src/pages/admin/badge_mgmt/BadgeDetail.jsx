import { useCallback,useState,useEffect } from "react";

import { useNavigate,useParams } from "react-router-dom";

import adminApi from "../../../services/adminApi";

import BadgePreview from "../../../components/admin/badge_detail/BadgePreview";
import BadgeBasicInfo from "../../../components/admin/badge_detail/BadgeBasicInfo";
import BadgeRules from "../../../components/admin/badge_detail/BadgeRules";
import BadgeAwardedUsers from "../../../components/admin/badge_detail/BadgeAwardedUsers";
import './BadgeDetail.css'

const BadgeDetail=()=>{
    const {badgeId}=useParams()
    const navigate=useNavigate()
    const [badge,setBadge]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [deleting,setDeleting]=useState(false)
    const fetchBadge=useCallback(async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await adminApi.get(
                `/badges/admin/${badgeId}/`
            )
            setBadge(response.data)
        }catch(err){
            console.error('failed to fetch badge:',err)
            setError(
                err.response?.data?.detail||
                'unable to load badge details'
            )
        }finally{
            setLoading(false)
        }
    },[badgeId])
    useEffect(()=>{
        fetchBadge()
    },[fetchBadge])
    const handleDelete=async ()=>{
        const confirmed=window.confirm(
            `are you sure you want to delete "${badge.name}"?`
        )
        if (!confirmed) return
        try{
            setDeleting(true)
            await adminApi.delete(
                `/badges/admin/${badgeId}/`
            )
            alert('badge deleted successfully')
            navigate('/admin/badge-management')
        }catch(err){
            console.error('failed to delete badge:',err)
            alert(err.response?.data?.error||'failed to delete badge')
        }finally{
            setDeleting(false)
        }
    }
    if (loading){
        return (
            <div className="container-fluid p-4 text-center">
                <div className="spinner-border text-primary"></div>
                <p className="text-muted mt-3">
                    Loading badge details...
                </p>
            </div>
        )
    }
    if (error||!badge){
        return (
            <div className="container-fluid p-4">
                <div className="alert alert-danger">
                    {error || 'Badge not found.'}
                </div>

                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Go Back
                </button>
            </div>
        )
    }
    return (
        <div className="badge-detail-page">

            <div className="container-fluid px-3 px-lg-5 py-4">

                {/* Header */}

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                    <div>
                        <button
                            className="btn btn-link text-decoration-none p-0 mb-3"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Badge Management
                        </button>

                        <h2 className="fw-bold mb-2">
                            Badge Details
                        </h2>

                        <p className="text-muted mb-0">
                            View badge information, achievement rules and awarded users.
                        </p>
                    </div>

                    <button
                        className="btn btn-outline-danger"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-trash me-2"></i>
                                Delete Badge
                            </>
                        )}
                    </button>

                </div>

                {/* Badge preview */}

                <BadgePreview badge={badge} />

                {/* Basic information */}

                <BadgeBasicInfo badge={badge} />

                {/* Properties */}

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">

                        <h5 className="fw-bold border-bottom pb-3 mb-4">
                            Properties
                        </h5>

                        <div className="row g-4">

                            <div className="col-md-6">
                                <label className="text-muted small fw-semibold text-uppercase">
                                    Rarity
                                </label>

                                <p className="fw-semibold mt-2 mb-0">
                                    {badge.rarity}
                                </p>
                            </div>

                            <div className="col-md-6">
                                <label className="text-muted small fw-semibold text-uppercase">
                                    Status
                                </label>

                                <p className="fw-semibold mt-2 mb-0">
                                    {badge.is_active ? 'Active' : 'Inactive'}
                                </p>
                            </div>

                            <div className="col-md-6">
                                <label className="text-muted small fw-semibold text-uppercase">
                                    XP Reward
                                </label>

                                <p className="fw-semibold mt-2 mb-0">
                                    {badge.xp_reward} XP
                                </p>
                            </div>

                            <div className="col-md-6">
                                <label className="text-muted small fw-semibold text-uppercase">
                                    Created On
                                </label>

                                <p className="fw-semibold mt-2 mb-0">
                                    {new Date(badge.created_at).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>

                        </div>

                    </div>
                </div>

                {/* Achievement rules */}

                <BadgeRules rules={badge.rules} />

                {/* Awarded users */}

                <BadgeAwardedUsers
                    users={badge.awarded_users}
                    total={badge.awarded_users_count}
                />

            </div>

        </div>
    )
}

export default BadgeDetail