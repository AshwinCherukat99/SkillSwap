import React,{useRef,useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {
    Plus,
    Trash2,
    Image,
    Info,
    Edit3,
    Clock3,
    CheckCircle2,
    Globe2,
} from 'lucide-react'

import mentorApi from '../../../services/mentorApi'

const CreateCourse=()=>{
    const navigate=useNavigate()
    const fileInputRef=useRef(null)
    const [formData,setFormData]=useState({
        title:'',
        slug:'',
        description:'',
        category:'',
        level:'BEGINNER',
        price:'',
        estimated_duration:'',
        thumbnail:null,
    })
    const [thumbnailPreview,setThumbnailPreview]=useState(null)
    const [modules,setModules]=useState([
        {
            id:Date.now(),
            title:'',
            description:'',
            lessons:[],
        },
    ])
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState('')
    const [success,setSuccess]=useState('')
    const [categories,setCategories]=useState([])
    const handleChange=(event)=>{
        const {name,value}=event.target
        setFormData((previous)=>({
            ...previous,
            [name]:value,
        }))
    }
    const handleThumbnailChange=(event)=>{
        const file=event.target.files[0]
        if (!file){
            return
        }
        setFormData((previous)=>({
            ...previous,
            thumbnail:file,
        }))
        setThumbnailPreview(URL.createObjectURL(file))
    }
    const addModule=()=>{
        setModules((previous)=>[
            ...previous,
            {
                id:Date.now(),
                title:'',
                description:'',
                lessons:[],
            },
        ])
    }
    const removeModule=(moduleId)=>{
        setModules((previous)=>
        previous.filter(
            (module)=>
                module.id!==moduleId
        ))
    }
    const handleModuleChange=(
        moduleId,
        field,
        value
    )=>{
        setModules((previous)=>
        previous.map((module)=>{
            if (module.id!==moduleId){
                return module
            }
            return {
                ...module,
                [field]:value,
            }
        }))
    }
    const addLesson=(moduleId)=>{
        setModules((previous)=>
        previous.map((module)=>{
            if (module.id!==moduleId){
                return module
            }
            return {
                ...module,
                lessons:[
                    ...module.lessons,
                    {
                        id:Date.now(),
                        title:'',
                        content:'',
                    }
                ]
            }
        }))
    }
    const removeLesson=(
        moduleId,
        lessonId
    )=>{
        setModules((previous)=>
        previous.map((module)=>{
            if (module.id!==moduleId){
                return module
            }
            return {
                ...module,
                lessons:module.lessons.filter(
                    (lesson)=>
                        lesson.id!==lessonId
                )
            }
        }))
    }
    const handleLessonChange=(
        moduleId,
        lessonId,
        field,
        value,
    )=>{
        setModules((previous)=>
        previous.map((module)=>{
            if (module.id!==moduleId){
                return module
            }
            return {
                ...module,
                lessons:module.lessons.map(
                    (lesson)=>{
                        if (lesson.id!==lessonId){
                            return lesson
                        }
                        return {
                            ...lesson,
                            [field]:value,
                        }
                    }
                )
            }
        }))
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        setError('')
        setSuccess('')
        if (!formData.title.trim()){
            setError('course title is required')
            return
        }
        if (!formData.description.trim()){
            setError('course description is required')
            return
        }
        if (!formData.category){
            setError('please select a category')
            return
        }
        if (!formData.estimated_duration){
            setError('estimated duration is required')
            return
        }
        try{
            setLoading(true)
            const data=new FormData()
            data.append('title',formData.title)
            data.append('slug',formData.slug)
            data.append('description',formData.description)
            data.append('category',formData.category)
            data.append('level',formData.level)
            data.append('price',formData.price)
            data.append('estimated_duration',formData.estimated_duration)
            if (formData.thumbnail){
                data.append('thumbnail',formData.thumbnail)
            }
            data.append(
                'modules',
                JSON.stringify(
                    modules.map((module)=>({
                        title:module.title,
                        descritption:module.description,
                        lessons:module.lessons.map((lesson)=>({
                            title:lesson.title,
                            content:lesson.content,
                        })),
                    }))
                )
            )
            const response=await mentorApi.post(
                'courses/mentor/management/',
                data,
                {
                    headers:{
                        'Content-Type':'multipart/form-data'
                    },
                }
            )
            const createdCourse=response.data
            setSuccess('course created successfully')
            console.log('Created Course:',createdCourse)
            setTimeout(()=>{
                navigate(`/mentor/courses/${createdCourse.id}`)
            },1000)
        }catch(error){
            console.error(error)
            const responseData=error.response?.data
            if (responseData && typeof responseData==='object'){
                setError(Object.values(responseData).flat().join(' '))
            }else{
                setError('failed to create a course')
            }
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        const fetchCategories=async ()=>{
            try{
                const response=await mentorApi.get('/courses/categories/')
                console.log('categories response:',response.data)
                setCategories(response.data)
            }catch(error){
                console.error('failed to fetch categories:',error)
            }
        }
        fetchCategories()
    },[])
    console.log('categories state:',categories)
    return (
         <div className="bg-light min-vh-100 pb-5">


            {/* ========================= */}
            {/* PAGE HEADER */}
            {/* ========================= */}

            <div className="bg-white border-bottom">

                <div className="container-fluid px-4 py-4">

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <h1 className="h4 fw-bold mb-1">
                                Create New Course
                            </h1>

                            <p className="text-muted mb-0">
                                Create your course and submit it
                                for administrator review.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                                navigate(
                                    '/mentor/courses'
                                )
                            }
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>


            <div className="container-fluid px-4 py-4">


                {/* ========================= */}
                {/* ALERTS */}
                {/* ========================= */}

                {error && (

                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>

                )}


                {success && (

                    <div
                        className="alert alert-success"
                        role="alert"
                    >
                        {success}
                    </div>

                )}


                {/* ========================= */}
                {/* APPROVAL INFORMATION */}
                {/* ========================= */}

                <section className="card border-0 shadow-sm mb-4">

                    <div className="card-body p-4">

                        <div className="d-flex align-items-start">

                            <Info
                                size={22}
                                className="text-primary me-2 flex-shrink-0"
                            />

                            <div>

                                <h2 className="h5 fw-bold">
                                    Course Approval Process
                                </h2>

                                <p className="text-muted mb-4">
                                    Your course will be created as
                                    a draft. An administrator will
                                    review the course before it is
                                    published.
                                </p>

                            </div>

                        </div>


                        <div className="row text-center">


                            {/* DRAFT */}

                            <div className="col-md-3 mb-3">

                                <div
                                    className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-2"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                    }}
                                >
                                    <Edit3 size={18} />
                                </div>

                                <div className="fw-semibold">
                                    Draft
                                </div>

                            </div>


                            {/* ADMIN REVIEW */}

                            <div className="col-md-3 mb-3">

                                <div
                                    className="rounded-circle bg-light text-secondary d-inline-flex align-items-center justify-content-center mb-2"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                    }}
                                >
                                    <Clock3 size={18} />
                                </div>

                                <div className="text-muted">
                                    Admin Review
                                </div>

                            </div>


                            {/* QUALITY CHECK */}

                            <div className="col-md-3 mb-3">

                                <div
                                    className="rounded-circle bg-light text-secondary d-inline-flex align-items-center justify-content-center mb-2"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                    }}
                                >
                                    <CheckCircle2 size={18} />
                                </div>

                                <div className="text-muted">
                                    Quality Check
                                </div>

                            </div>


                            {/* PUBLISHED */}

                            <div className="col-md-3 mb-3">

                                <div
                                    className="rounded-circle bg-light text-secondary d-inline-flex align-items-center justify-content-center mb-2"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                    }}
                                >
                                    <Globe2 size={18} />
                                </div>

                                <div className="text-muted">
                                    Published
                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                <form onSubmit={handleSubmit}>


                    <div className="row g-4">


                        {/* ========================= */}
                        {/* LEFT COLUMN */}
                        {/* ========================= */}

                        <div className="col-lg-8">


                            {/* ========================= */}
                            {/* BASIC INFORMATION */}
                            {/* ========================= */}

                            <section className="card border-0 shadow-sm mb-4">

                                <div className="card-body p-4">

                                    <h3 className="h5 fw-bold border-bottom pb-3 mb-4">
                                        Basic Information
                                    </h3>


                                    {/* TITLE */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Course Title
                                        </label>

                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="e.g. Advanced React Patterns"
                                            maxLength={200}
                                        />

                                    </div>


                                    {/* SLUG */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Course Slug
                                        </label>

                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="advanced-react-patterns"
                                        />

                                        <div className="form-text">
                                            Used in the course URL.
                                        </div>

                                    </div>


                                    <div className="row">


                                        {/* CATEGORY */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">
                                                Category
                                            </label>

                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="form-select"
                                            >

                                                <option value="">
                                                    Select Category...
                                                </option>

                                                {categories.map((category)=>(
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}

                                            </select>

                                        </div>


                                        {/* LEVEL */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">
                                                Difficulty Level
                                            </label>

                                            <select
                                                name="level"
                                                value={formData.level}
                                                onChange={handleChange}
                                                className="form-select"
                                            >

                                                <option value="BEGINNER">
                                                    Beginner
                                                </option>

                                                <option value="INTERMEDIATE">
                                                    Intermediate
                                                </option>

                                                <option value="ADVANCED">
                                                    Advanced
                                                </option>

                                            </select>

                                        </div>

                                    </div>


                                    {/* DESCRIPTION */}

                                    <div>

                                        <label className="form-label fw-semibold">
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="form-control"
                                            rows="5"
                                            maxLength={300}
                                            placeholder="Briefly describe what this course covers..."
                                        />

                                        <div className="form-text text-end">
                                            {formData.description.length}/300
                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* ========================= */}
                            {/* COURSE STRUCTURE */}
                            {/* ========================= */}

                            <section className="card border-0 shadow-sm mb-4">

                                <div className="card-body p-4">


                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">

                                        <h3 className="h5 fw-bold mb-0">
                                            Course Structure
                                        </h3>


                                        <button
                                            type="button"
                                            className="btn btn-link text-decoration-none"
                                            onClick={addModule}
                                        >
                                            <Plus
                                                size={17}
                                                className="me-1"
                                            />

                                            Add Module
                                        </button>

                                    </div>


                                    {modules.map(
                                        (
                                            module,
                                            moduleIndex
                                        ) => (

                                            <div
                                                key={module.id}
                                                className="border rounded-3 p-3 mb-3"
                                            >


                                                {/* MODULE HEADER */}

                                                <div className="d-flex justify-content-between align-items-center mb-3">

                                                    <h4 className="h6 fw-bold mb-0">

                                                        Module{' '}

                                                        {moduleIndex + 1}

                                                    </h4>


                                                    {modules.length > 1 && (

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                removeModule(
                                                                    module.id
                                                                )
                                                            }
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>

                                                    )}

                                                </div>


                                                {/* MODULE TITLE */}

                                                <input
                                                    type="text"
                                                    className="form-control mb-2"
                                                    placeholder="Module title"
                                                    value={module.title}
                                                    onChange={(event) =>
                                                        handleModuleChange(
                                                            module.id,
                                                            'title',
                                                            event.target.value
                                                        )
                                                    }
                                                />


                                                {/* MODULE DESCRIPTION */}

                                                <textarea
                                                    className="form-control mb-3"
                                                    rows="2"
                                                    placeholder="Module description"
                                                    value={module.description}
                                                    onChange={(event) =>
                                                        handleModuleChange(
                                                            module.id,
                                                            'description',
                                                            event.target.value
                                                        )
                                                    }
                                                />


                                                {/* LESSONS */}

                                                {module.lessons.map(
                                                    (
                                                        lesson,
                                                        lessonIndex
                                                    ) => (

                                                        <div
                                                            key={lesson.id}
                                                            className="bg-light border rounded-3 p-3 mb-2"
                                                        >

                                                            <div className="d-flex justify-content-between align-items-center mb-2">

                                                                <span className="small fw-semibold">
                                                                    Lesson{' '}
                                                                    {lessonIndex + 1}
                                                                </span>


                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() =>
                                                                        removeLesson(
                                                                            module.id,
                                                                            lesson.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2
                                                                        size={14}
                                                                    />
                                                                </button>

                                                            </div>


                                                            <input
                                                                type="text"
                                                                className="form-control mb-2"
                                                                placeholder="Lesson title"
                                                                value={
                                                                    lesson.title
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleLessonChange(
                                                                        module.id,
                                                                        lesson.id,
                                                                        'title',
                                                                        event.target.value
                                                                    )
                                                                }
                                                            />


                                                            <textarea
                                                                className="form-control"
                                                                rows="5"
                                                                placeholder="Lesson content"
                                                                value={
                                                                    lesson.content
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleLessonChange(
                                                                        module.id,
                                                                        lesson.id,
                                                                        'content',
                                                                        event.target.value
                                                                    )
                                                                }
                                                            />

                                                        </div>

                                                    )
                                                )}


                                                {/* ADD LESSON */}

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary mt-2"
                                                    onClick={() =>
                                                        addLesson(
                                                            module.id
                                                        )
                                                    }
                                                >

                                                    <Plus
                                                        size={15}
                                                        className="me-1"
                                                    />

                                                    Add Lesson

                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        </div>


                        {/* ========================= */}
                        {/* RIGHT COLUMN */}
                        {/* ========================= */}

                        <div className="col-lg-4">


                            {/* ========================= */}
                            {/* THUMBNAIL */}
                            {/* ========================= */}

                            <section className="card border-0 shadow-sm mb-4">

                                <div className="card-body p-4">

                                    <h3 className="h5 fw-bold border-bottom pb-3 mb-4">
                                        Course Thumbnail
                                    </h3>


                                    <div
                                        className="border border-2 border-dashed rounded-3 p-4 text-center"
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >

                                        {thumbnailPreview ? (

                                            <img
                                                src={thumbnailPreview}
                                                alt="Course thumbnail preview"
                                                className="img-fluid rounded"
                                            />

                                        ) : (

                                            <>

                                                <Image
                                                    size={42}
                                                    className="text-primary mb-3"
                                                />

                                                <div className="fw-semibold">
                                                    Click to upload
                                                </div>

                                                <div className="text-muted small">
                                                    1280 × 720 (16:9)
                                                    recommended
                                                </div>

                                            </>

                                        )}

                                    </div>


                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="d-none"
                                        onChange={
                                            handleThumbnailChange
                                        }
                                    />

                                </div>

                            </section>


                            {/* ========================= */}
                            {/* PRICING */}
                            {/* ========================= */}

                            <section className="card border-0 shadow-sm mb-4">

                                <div className="card-body p-4">

                                    <h3 className="h5 fw-bold border-bottom pb-3 mb-4">
                                        Pricing & Duration
                                    </h3>


                                    {/* PRICE */}

                                    <label className="form-label fw-semibold">
                                        Enrollment Fee (₹)
                                    </label>

                                    <div className="input-group mb-4">

                                        <span className="input-group-text">
                                            ₹
                                        </span>

                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="form-control"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                        />

                                    </div>


                                    {/* DURATION */}

                                    <label className="form-label fw-semibold">
                                        Estimated Duration
                                    </label>

                                    <div className="input-group">

                                        <input
                                            type="number"
                                            name="estimated_duration"
                                            value={
                                                formData.estimated_duration
                                            }
                                            onChange={handleChange}
                                            className="form-control"
                                            min="1"
                                            placeholder="120"
                                        />

                                        <span className="input-group-text">
                                            minutes
                                        </span>

                                    </div>

                                </div>

                            </section>

                        </div>

                    </div>


                    {/* ========================= */}
                    {/* CREATE BUTTON */}
                    {/* ========================= */}

                    <div className="d-flex justify-content-end mt-4">

                        <button
                            type="submit"
                            className="btn btn-primary px-4 py-2"
                            disabled={loading}
                        >

                            {loading
                                ? 'Creating Course...'
                                : 'Create Course'
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default CreateCourse