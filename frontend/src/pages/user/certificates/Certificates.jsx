import React,{useEffect,useMemo,useState} from 'react'
import {useLocation,useSearchParams} from 'react-router-dom'
import api from '../../../services/api'

import CertificateHeader from '../../../components/user/certificates/CertificateHeader'
import CertificateStats from '../../../components/user/certificates/CertificateStats'
import CertificateFilters from '../../../components/user/certificates/CertificateFilters'
import CertificateGrid from '../../../components/user/certificates/CertificateGrid'

import './Certificates.css'

function Certificates(){
    const location=useLocation()
    const [searchParams]=useSearchParams()
    const [certificates,setCertificates]=useState([])
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [search,setSearch]=useState('')
    const [selectedCategory,setSelectedCategory]=useState('all')
    const selectedCertificateId=searchParams.get('certificateId')||location.state?.certificateId||null
    useEffect(()=>{
        const fetchCertificates=async ()=>{
            try{
                setLoading(true)
                setError('')
                const response=await api.get('/certificates/')
                setCertificates(response.data.certificates||response.data||[])
            }catch(error){
                console.error('failed to load certificates:',error)
                setError(error.response?.data?.error||'unable to load certificates')
            }finally{
                setLoading(false)
            }
        }
        fetchCertificates()
    },[])
    
const filteredCertificates = useMemo(() => {
  return certificates.filter((certificate) => {
    const searchValue = search.trim().toLowerCase()

    const matchesSearch =
      !searchValue ||
      (certificate.course_title || '')
        .toLowerCase()
        .includes(searchValue) ||
      String(certificate.certificate_number || '')
        .toLowerCase()
        .includes(searchValue) ||
      String(certificate.certificate_id ?? '')
        .toLowerCase()
        .includes(searchValue) ||
      (certificate.course_category || '')
        .toLowerCase()
        .includes(searchValue)

    const matchesCategory =
      selectedCategory === 'all' ||
      certificate.course_category === selectedCategory

    return matchesSearch && matchesCategory
  })
}, [certificates, search, selectedCategory])

    const [sortOrder,setSortOrder]=useState('newest')
    const sortedCertificates=useMemo(()=>{
        const result=[...filteredCertificates]
        result.sort((a,b)=>{
            const dateA=new Date(a.issued_at||0).getTime()
            const dateB=new Date(b.issued_at||0).getTime()
            if (sortOrder=='newest'){
                return dateB-dateA
            }
            if (sortOrder=='oldest'){
                return dateA-dateB
            }
            if (sortOrder==='highest-score'){
                return (
                    Number(b.score||0)-Number(a.score||0)
                )
            }
            if (sortOrder==='lowest-score'){
                return (
                    Number(a.score||0)-Number(b.score||0)
                )
            }
            return 0
        })
        return result
    },[filteredCertificates,sortOrder])
    const clearFilters=()=>{
        setSearch('')
        setSelectedCategory('all')
        setSortOrder('newest')
    }
    if (loading){
        return (
            <div className="container py-5">

                <div className="d-flex justify-content-center align-items-center py-5">

                    <div className="text-center">

                        <div
                            className="spinner-border text-primary mb-3"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p className="text-muted mb-0">
                            Loading your certificates...
                        </p>

                    </div>

                </div>

            </div>
        )
    }
    if (error){
        return (
            <div className="container py-5">

                <div className="alert alert-danger">

                    <div className="d-flex align-items-center">

                        <i className="bi bi-exclamation-circle-fill fs-4 me-3"></i>

                        <div>
                            <h6 className="fw-semibold mb-1">
                                Unable to load certificates
                            </h6>

                            <p className="mb-0">
                                {error}
                            </p>
                        </div>

                    </div>

                    <button
                        className="btn btn-outline-danger btn-sm mt-3"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        )
    }
    return (
        <div className="certificates-page">

            <div className="container py-4 py-lg-5">

                {/* ================================= */}
                {/* Header */}
                {/* ================================= */}

                <CertificateHeader
                    totalCertificates={certificates.length}
                    onVerify={() => setShowVerifyModal(true)}
                />

                {/* ================================= */}
                {/* Stats */}
                {/* ================================= */}

                <CertificateStats
                    certificates={certificates}
                />

                {/* ================================= */}
                {/* Search + Filters */}
                {/* ================================= */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body p-4">

                        {/* Search and Sort */}
                        <div className="row g-3 align-items-center mb-4">

                            {/* Search */}
                            <div className="col-12 col-lg-8">

                                <div className="input-group">

                                    <span className="input-group-text bg-white">
                                        <i className="bi bi-search"></i>
                                    </span>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search certificates..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />

                                    {search && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setSearch("")
                                            }
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    )}

                                </div>

                            </div>

                            {/* Sort */}
                            <div className="col-12 col-lg-4">

                                <select
                                    className="form-select"
                                    value={sortOrder}
                                    onChange={(e) =>
                                        setSortOrder(e.target.value)
                                    }
                                >
                                    <option value="newest">
                                        Newest First
                                    </option>

                                    <option value="oldest">
                                        Oldest First
                                    </option>

                                    <option value="highest-score">
                                        Highest Score
                                    </option>

                                    <option value="lowest-score">
                                        Lowest Score
                                    </option>
                                </select>

                            </div>

                        </div>

                        {/* Category filters */}
                        <CertificateFilters
                            certificates={certificates}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />

                    </div>

                </div>

                {/* ================================= */}
                {/* Results information */}
                {/* ================================= */}

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <div>
                        <h5 className="fw-semibold mb-1">
                            My Certificates
                        </h5>

                        <small className="text-muted">
                            Showing {sortedCertificates.length}{" "}
                            {sortedCertificates.length === 1
                                ? "certificate"
                                : "certificates"}
                        </small>
                    </div>

                    {(search || selectedCategory !== "all") && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={clearFilters}
                        >
                            <i className="bi bi-x-circle me-1"></i>
                            Clear Filters
                        </button>
                    )}

                </div>

                {/* ================================= */}
                {/* Certificate Grid */}
                {/* ================================= */}

                <CertificateGrid
                    certificates={sortedCertificates}
                    selectedCertificateId={selectedCertificateId}
                />

            </div>

        </div>
    )
}

export default Certificates