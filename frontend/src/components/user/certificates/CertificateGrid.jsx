import React from 'react'
import CertificateCard from './CertificateCard'
import CertificateEmptyState from './CertificateEmptyState'

function CertificateGrid({certificates=[]}){
    if (certificates.length===0){
        return <CertificateEmptyState/>
    }
    return (
        <div className="row g-4">

            {certificates.map((certificate) => (
                <CertificateCard
                    key={certificate.certificate_id}
                    certificate={certificate}
                />
            ))}

        </div>
    )
}

export default CertificateGrid