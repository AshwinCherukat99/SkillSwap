import { useEffect,useState,useMemo } from "react";

import CategoryTable from "../../../components/admin/course_category/CategoryTable";
import CategoryFormModal from "../../../components/admin/course_category/CategoryFormModal";
import DeleteCategoryModal from "../../../components/admin/course_category/DeleteCategoryModal";
import './CourseCategoryManagement.css'

import adminApi from "../../../services/adminApi";

const CourseCategoryManagement=()=>{
    const [categories,setCategories]=useState([])
    const [loading,setLoading]=useState(true)
    const [search,setSearch]=useState('')
    const [sort,setSort]=useState('most')
    const [showFormModal,setShowFormModal]=useState(false)
    const [formMode,setFormMode]=useState('create')
    const [selectedCategory,setSelectedCategory]=useState(null)
    const [showDeleteModal,setShowDeleteModal]=useState(false)
    const [deletingCategory,setDeletingCategory]=useState(null)
    const [saving,setSaving]=useState(false)
    const [deleting,setDeleting]=useState(false)
    const [error,setError]=useState('')
    const CATEGORY_URL='/admin/course-categories/'
    const fetchCategories=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await adminApi.get(CATEGORY_URL)
            const data=response.data
            setCategories(Array.isArray(data)?data:data.categories||[])
        }catch(err){
            console.error('failed to fetch categories:',err)
            setError(err.response?.data?.detail||'failed to load course categories')
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchCategories()
    },[])
    const getCourseCount=(category)=>{
        return Number(
            category.course_count??
            category.courses_count??
            0
        )
    }
    const totalCourses=useMemo(()=>{
        return categories.reduce(
            (total,category)=>total+getCourseCount(category),
            0
        )
    },[categories])
    const filteredCategories=useMemo(()=>{
        let result=categories.filter((category)=>
        category.name.toLowerCase().includes(search.toLowerCase().trim()))
        result=[...result]
        switch(sort){
            case "most":
                result.sort(
                    (a,b)=>getCourseCount(b)-getCourseCount(a)
                ) 
                break
            case "fewest":
                result.sort(
                    (a,b)=>getCourseCount(a)-getCourseCount(b)
                )
                break
            case "az":
                result.sort(
                    (a,b)=>
                        a.name.localeCompare(b.name)
                )
                break
            case "za":
                result.sort(
                    (a,b)=>
                        b.name.localeCompare(a.name)
                )
                break
            default:
                break
        }
        return result
    },[categories,search,sort])
    const openCreateModal=()=>{
        setSelectedCategory(null)
        setFormMode('create')
        setShowFormModal(true)
    }
    const openEditModal=(category)=>{
        setSelectedCategory(category)
        setFormMode('edit')
        setShowFormModal(true)
    }
    const handleCategorySubmit=async (name)=>{
        try{
            setSaving(true)
            if (formMode==='create'){
                const response=await adminApi.post(
                    CATEGORY_URL,
                    {name}
                )
                alert(response.data.message||
                    'category created successfully'
                )
            }else{
                const response=await adminApi.patch(
                    `${CATEGORY_URL}${selectedCategory.id}/`,
                    {name}
                )
                alert(response.data.message||'category updated successfully')
            }
            setShowFormModal(false)
            setSelectedCategory(null)
            await fetchCategories()
        }catch(err){
            console.error('category save failed:',err)
            const errorMessage=
            err.response?.data?.name?.[0]||
            err.response?.data?.error||
            err.response?.data?.detail||
            'failed to save category'
            alert(errorMessage)
        }finally{
            setSaving(false)
        }
    }
    const openDeleteModal=(category)=>{
        setDeletingCategory(category)
        setShowDeleteModal(true)
    }         
    const handleDeleteCategory=async ()=>{
        if (!deletingCategory) return
        try{
            setDeleting(true)
            const response=await adminApi.delete(
                `${CATEGORY_URL}${deletingCategory.id}/`
            )
            alert(response.data?.message||'category deleted successully') 
            setShowDeleteModal(false)
            setDeletingCategory(null)
            await fetchCategories()
        }catch(err){
            console.error('category deletion failed:',err)
            alert(
                err.response?.data?.error||
                err.resposne?.data?.detail||
                'failed to delete category'
            )
        }finally{
            setDeleting(false)
        }
    }
    return (
        <div className="container-fluid course-category-page px-4 py-4">

            {/* Page Header */}

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                <div>

                    <div className="small text-muted mb-2">
                        Admin Dashboard <i className="bi bi-chevron-right mx-1"></i>
                        Course Management <i className="bi bi-chevron-right mx-1"></i>
                        <span className="text-primary fw-semibold">Categories</span>
                    </div>

                    <h2 className="fw-bold mb-1">
                        Course Categories
                    </h2>

                    <p className="text-muted mb-0">
                        Organize and manage categories for courses available on SkillSwap.
                    </p>

                </div>

                <button
                    className="btn btn-primary px-4 py-2"
                    onClick={openCreateModal}
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Category
                </button>

            </div>

            {/* Error */}

            {error && (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{error}</span>

                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={fetchCategories}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Summary Cards */}

            <div className="row g-4 mb-4">

                <div className="col-md-6">

                    <div className="card border-0 shadow-sm category-stat-card h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-2">
                                        Total Categories
                                    </p>

                                    <h2 className="fw-bold mb-2">
                                        {loading ? "—" : categories.length}
                                    </h2>

                                    <p className="text-muted small mb-0">
                                        Course classification categories
                                    </p>
                                </div>

                                <div className="category-stat-icon purple">
                                    <i className="bi bi-layers-fill"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="col-md-6">

                    <div className="card border-0 shadow-sm category-stat-card h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-2">
                                        Total Courses
                                    </p>

                                    <h2 className="fw-bold mb-2">
                                        {loading ? "—" : totalCourses}
                                    </h2>

                                    <p className="text-muted small mb-0">
                                        Courses mapped across all categories
                                    </p>
                                </div>

                                <div className="category-stat-icon green">
                                    <i className="bi bi-book-half"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Category Table */}

            {loading ? (

                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="text-muted mt-2">Loading categories...</p>
                </div>

            ) : (

                <CategoryTable
                    categories={filteredCategories}
                    search={search}
                    setSearch={setSearch}
                    sort={sort}
                    setSort={setSort}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                />

            )}

            {/* Create / Edit Modal */}

            <CategoryFormModal
                show={showFormModal}
                mode={formMode}
                category={selectedCategory}
                onClose={() => setShowFormModal(false)}
                onSubmit={handleCategorySubmit}
                saving={saving}
            />

            {/* Delete Modal */}

            <DeleteCategoryModal
                show={showDeleteModal}
                category={deletingCategory}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteCategory}
                deleting={deleting}
            />

        </div>
    )
}

export default CourseCategoryManagement