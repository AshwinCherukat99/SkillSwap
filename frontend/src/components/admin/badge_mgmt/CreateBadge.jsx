import React,{useState} from "react";

import {useNavigate} from 'react-router-dom'

import BadgeForm from "./BadgeForm";

import adminApi from '../../../services/adminApi'

const CreateBadge=()=>{
    const navigate=useNavigate()
    const [submitting,setSubmitting]=useState(false)
    const handleSubmit=async (data)=>{
        try{
            setSubmitting(true)
            await adminApi.post(
                '/badges/admin/',
                data,
            )
            navigate('/admin/badge-management')
        }catch(err){
            console.error('failed to create badge:',err)
        }finally{
            setSubmitting(false)
        }
    }
    return (
        <div className="container-fluid px-4 py-4">

            <div className="mb-4">

                <h2 className="fw-bold">
                    Create New Badge
                </h2>

                <p className="text-muted">
                    Create a new achievement badge and
                    define how users can earn it.
                </p>

            </div>

            <div className="row">

                <div className="col-xl-9">

                    <BadgeForm
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        submitLabel="Create Badge"
                    />

                </div>

            </div>

        </div>
    )
}

export default CreateBadge