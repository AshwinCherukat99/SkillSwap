import React,{useEffect,useState} from "react";

import {useNavigate,useParams} from 'react-router-dom'

import BadgeForm from "./BadgeForm";

import adminApi from "../../../services/adminApi";

const EditBadge=()=>{
    const {badgeId}=useParams()
    const navigate=useNavigate()
    const [badge,setBadge]=useState(null)
    const [loading,setLoading]=useState(true)
    const [submitting,setSubmitting]=useState(false)
    const loadBadge=async ()=>{
        try{
            const response=await adminApi.get(
                `/badges/admin/${badgeId}`
            )
            setBadge(response.data)
        }catch(err){
            console.error('failed to load badge:',err)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        loadBadge()
    },[badgeId])
    const handleSubmit=async (data)=>{
        try{
            setSubmitting(true)
            await adminApi.patch(
                `/badges/admin/${badgeId}/`,
                data
            )
            navigate('/admin/badge-management/')
        }catch(err){
            console.error('failed to update badge:',err)
        }finally{
            setSubmitting(false)
        }
    }
    if (loading){
        return (
            <div className="text-center py-5">

                <div className="spinner-border text-primary"></div>

            </div>
        )
    }
    if (!badge){
        return (
            <div className="alert alert-danger m-4">
                Badge not found.
            </div>
        )
    }         
    return (
        <div className="container-fluid px-4 py-4">

            <div className="mb-4">

                <h2 className="fw-bold">
                    Edit Badge
                </h2>

                <p className="text-muted">
                    Update badge information and
                    achievement rules.
                </p>

            </div>

            <div className="row">

                <div className="col-xl-9">

                    <BadgeForm
                        initialData={badge}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        submitLabel="Save Changes"
                    />

                </div>

            </div>

        </div>
    )
}

export default EditBadge