import React,{useEffect,useState} from "react";

import api from '../../../services/api'

const SuggestSkillModal=({
    show,
    onClose,
    suggestedFor='OFFER',
    onSuccess
})=>{
    const [name,setName]=useState('')
    const [description,setDescription]=useState('')
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState('')
    const [success,setSuccess]=useState('')
    const MAX_DESCRIPTION_LENGTH=300
    useEffect(()=>{
        if (show){
            setName('')
            setDescription('')
            setError('')
            setSuccess('')
            setLoading(false)
        }
    },[show])
    const handleClose=()=>{
        if (loading){
            return
        }   
        onClose()
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        setError('')
        setSuccess('')
        const trimmedName=name.trim()
        if (!trimmedName){
            setError('please enter a skill name')
            return
        }
        if (trimmedName.length>100){
            setError('skill name cannot exceed 100 characters')
            return
        }
        try{
            setLoading(true)
            await api.post(
                '/skills/suggest/',
                {
                    name:trimmedName,
                    description:description.trim(),
                    suggested_for:suggestedFor,
                }
            )
            setSuccess('your skill suggestion has been submitted for approval')
            if (onSuccess){
                onSuccess()
            }
            setTimeout(()=>{
                onClose()
            },1200)
        }catch(error){
            console.error()
        }
    }
}