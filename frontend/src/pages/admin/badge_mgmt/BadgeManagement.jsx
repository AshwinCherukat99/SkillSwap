import React,{useEffect,useState} from "react";

import {useNavigate} from 'react-router-dom'

import BadgeCard from '../../../components/admin/badge_mgmt/BadgeCard'

import adminApi from "../../../services/adminApi";

const BadgeManagement=()=>{
    const navigate=useNavigate()
    const [badges,setBadges]=useState([])
    const [loading,setLoading]=useState(true)
    const [search,setSearch]=useState('')
    const [rarity,setRarity]=useState('')
    const [statusFilter,setStatusFilter]=useState('')
    useEffect(()=>{
        loadBadges()
    },[search,rarity,statusFilter])
    const loadBadges=async ()=>{
        try{
            setLoading(true)
            const response=await adminApi.get(
                '/badges/admin/',{
                search,
                rarity,
                status:statusFilter,}
            )
            setBadges(response.data.badges)
        }catch(err){
            console.error('failed to load badges:',err)
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className="container-fluid px-4 py-4">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1 className="fw-bold mb-1">
                        Badges
                    </h1>

                    <p className="text-muted mb-0">
                        Manage achievement badges.
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate("/admin/badges/create")
                    }
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Create New Badge
                </button>

            </div>


            {/* Filters */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="row g-3">

                        <div className="col-md-6">

                            <div className="input-group">

                                <span className="input-group-text bg-white">
                                    <i className="bi bi-search"></i>
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search badges..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                        <div className="col-md-3">

                            <select
                                className="form-select"
                                value={rarity}
                                onChange={(e) =>
                                    setRarity(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Rarities
                                </option>

                                <option value="COMMON">
                                    Common
                                </option>

                                <option value="RARE">
                                    Rare
                                </option>

                                <option value="EPIC">
                                    Epic
                                </option>

                                <option value="LEGENDARY">
                                    Legendary
                                </option>

                            </select>

                        </div>

                        <div className="col-md-3">

                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Status
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>


            {/* Badges */}

            {loading ? (

                <div className="text-center py-5">

                    <div className="spinner-border text-primary"></div>

                </div>

            ) : badges.length === 0 ? (

                <div className="text-center py-5">

                    <i className="bi bi-award fs-1 text-muted"></i>

                    <h5 className="mt-3">
                        No badges found
                    </h5>

                    <p className="text-muted">
                        Create your first achievement badge.
                    </p>

                </div>

            ) : (

                <div className="row g-4">

                    {badges.map(badge => (

                        <div
                            className="col-md-6 col-xl-4"
                            key={badge.id}
                        >

                            <BadgeCard
                                badge={badge}
                                onView={(badge) =>
                                    navigate(
                                        `/admin/badges/${badge.id}`
                                    )
                                }
                                onEdit={(badge) =>
                                    navigate(
                                        `/admin/badges/${badge.id}/edit`
                                    )
                                }
                            />

                        </div>

                    ))}

                </div>

            )}

        </div>
    )
}

export default BadgeManagement