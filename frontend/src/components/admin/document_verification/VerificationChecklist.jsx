import React,{useState} from 'react'

import { ClipboardCheck } from 'lucide-react'

const VerificationChecklist=({verification,onVerificationChange})=>{
    const items=[
        {
            key: 'identity_verified',
            title: 'Identity Verification',
            description:
                'Government ID matches the mentor profile.',
        },
        {
            key: 'education_verified',
            title: 'Education Degree',
            description:
                'Education document has been verified.',
        },
        {
            key: 'certifications_verified',
            title: 'Certifications',
            description:
                'Submitted certifications have been verified.',
        },
        {
            key: 'portfolio_verified',
            title: 'Portfolio Review',
            description:
                'Submitted portfolio has been reviewed.',
        },
    ]
    const [updatingKey,setUpdatingKey]=useState(null)
    const handleToggle=async (key,currentValue)=>{
        const newValue=!currentValue
        try{
            setUpdatingKey(key)
            await onVerificationChange(
                key,
                newValue
            )
        }catch(error){
            console.error('verification update failed:',error)
        }finally{
            setUpdatingKey(null)
        }
    }
    return (
        <section className="card border-0 shadow-sm verification-card">

            <div className="card-body p-4">

                <h3 className="h6 fw-bold mb-4 d-flex align-items-center gap-2">

                    <ClipboardCheck
                        size={20}
                        className="text-primary"
                    />

                    Verification Checklist

                </h3>


                <div className="d-flex flex-column gap-2">

                    {items.map((item) => {

                        const verified =
                            verification?.[item.key] === true

                        const updating=updatingKey===item.key

                        return (
                            <div
                                key={item.key}
                                className={
                                    `verification-check-item ${
                                        verified
                                            ? 'verified'
                                            : ''
                                    }`
                                }
                            >

                                <div className="form-check">

                                    <input
                                        id={`verification-${item.key}`}
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={verified}
                                        disabled={updating}
                                        onChange={()=>
                                            handleToggle(item.key,verified)
                                        }
                                    />

                                    <label htmlFor={`verification-${item.key}`} 
                                    className="form-check-label"
                                    style={{
                                        cursor:updating?'default':'pointer'
                                    }}>

                                        <div className="fw-semibold">
                                            {item.title}
                                        </div>

                                        <div className="small text-muted">
                                            {item.description}
                                        </div>

                                    </label>

                                </div>

                            </div>
                        )
                    })}

                </div>


                {verification?.internal_notes && (
                    <div className="mt-4">

                        <label className="form-label small fw-semibold text-muted">
                            Internal Verification Notes
                        </label>

                        <div className="bg-light border rounded p-3 small">
                            {verification.internal_notes}
                        </div>

                    </div>
                )}

            </div>

        </section>
    )
}

export default VerificationChecklist