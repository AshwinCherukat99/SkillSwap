import React from 'react'
import CertificateCard from './CertificateCard'
import CertificateEmptyState from './CertificateEmptyState'

function CertificateGrid({certificates=[],selectedCertifcateId=null}){
    if (certificates.length===0){
        return <CertificateEmptyState/>
    }
    return (
        <div className="row g-4">

            {certificates.map((certificate) => (
                <CertificateCard
                    key={certificate.certificate_id}
                    certificate={certificate}
                    isSelected={
                        String(certificate.certificate_id)===String(selectedCertifcateId)
                    }
                />
            ))}

        </div>
    )
}

export default CertificateGrid