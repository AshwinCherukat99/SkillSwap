import React,{useEffect,useState} from "react";
import {useNavigate,useParams} from 'react-router-dom'

import mentorApi from '../../../services/mentorApi'

import EditCourseHeader from "../../../components/mentor/edit_course/EditCourseHeader";
import CourseBasicInfo from "../../../components/mentor/edit_course/CourseBasicInfo";
import CourseCurriculumEditor from "../../../components/mentor/edit_course/CourseCurriculumEditor";

import './EditCourse.css'

function EditCourse(){
    const {courseId}=useParams()
    const navigate=useNavigate()
    const [course,setCourse]=useState(null)
    const [categories,setCategories]=useState([])
    const [formData,setFormData]=useState({
        title:'',
        slug:'',
        description:'',
        category:'',
        level:'BEGINNER',
        price:'',
        estimated_duration:'',
        thumbnail:null,
        thumbnailPreview:null,
    })
    const [modules,setModules]=useState([])
    const [loading,setLoading]=useState(true)
    const [saving,setSaving]=useState(false)
    const [error,setError]=useState('')
    const [success,setSuccess]=useState('')
    useEffect(()=>{
        fetchCourse()
        fetchCategories()
    },[courseId])
    const fetchCourse=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await mentorApi.get(
                `/courses/mentor/courses/${courseId}`
            )
            const data=response.data
            setCourse(data)
            setFormData({
                title:data.title||'',
                slug:data.slug||'',
                description:data.description||'',
                category:data.category||data.category_id||'',
                level:data.level||'BEGINNER',
                price:data.price??'',
                estimated_duration:data.estimated_duration??'',
                thumbnail:null,
                thumbnailPreview:data.thumbnail||null
            })
            setModules(
                (data.modules||[]).map((module)=>({
                    id:module.id,
                    title:module.title||'',
                    description:module.description||'',
                    lessons:(module.lessons||[]).map(
                        (lesson)=>({
                            id:lesson.id,
                            title:lesson.title||'',
                            content:lesson.content||'',
                            order:lesson.order,
                        })
                    ),
                }))
            )
        }catch(err){
            console.error(err)
            setError(err.response?.data?.error||'unable to load course')
        }finally{
            setLoading(false)
        }
    }
    const fetchCategories=async ()=>{
        try{
            const response=await mentorApi.get(
                '/courses/categories/'
            )
            setCategories(response.data.results||
                response.data.categories||
                response.data||
                []
            )
        }catch(err){
            console.error('umable to load categories:',err)
        }
    }
    const handleBasicChange=(event)=>{
        const {name,value}=event.target
        setFormData((previous)=>({
            ...previous,
            [name]:value,
        }))
    }
    const handleThumbnailChange=(event)=>{
        const file=event.target.files?.[0]
        if (!file){
            return
        }
        setFormData((previous)=>({
            ...previous,
            thumbnail:file,
            thumbnailPreview:URL.createObjectURL(file),
        }))
    }
    const addModule=()=>{
        setModules((previous)=>[
            ...previous,{
                title:'',
                description:'',
                lessons:[],
            }
        ])
    } 
    const removeModule=(moduleIndex)=>{
        setModules((previous)=>
        previous.filter(
            (_,index)=>index!==moduleIndex
        ))
    }
    const handleModuleChange=(
        moduleIndex,
        field,
        value
    )=>{
        setModules((previous)=>
        previous.map((module,index)=>
        index===moduleIndex?{
            ...module,
            [field]:value,
        }:module))
    }
    const addLesson=(moduleIndex)=>{
        setModules((previous)=>
        previous.map((module,index)=>{
            if (index!==moduleIndex){
                return module
            }
            return {
                ...module,
                lessons:[
                    ...module.lessons,
                    {
                        title:'',
                        content:'',
                    }
                ]
            }
        }))
    }
    const removeLesson=(moduleIndex,lessonIndex)=>{
        setModules((previous)=>
        previous.map((module,index)=>{
            if (index!==moduleIndex){
                return module
            }
            return {
                ...module,
                lessons:module.lessons.filter(
                    (_,index)=>index!==lessonIndex
                )
            }
        }))
    }
    const handleLessonChange=(
        moduleIndex,
        lessonIndex,
        field,
        value,
    )=>{
        setModules((previous)=>
        previous.map((module,moduleIndexValue)=>{
            if (moduleIndexValue!==moduleIndex){
                return module
            }
            return {
                ...module,
                lessons:module.lessons.map(
                    (lesson,lessonIndexValue)=>
                        lessonIndexValue===lessonIndex
                    ?{
                        ...lesson,
                        [field]:value,
                    }:lesson
                )
            }
        }))
    }
    const validateForm=()=>{
        if (!formData.title.trim()){
            return 'course title is required'
        }
        if (!formData.slug.trim()){
            return 'course slug is required'
        }
        if (!formData.category){
            return 'please select a course category'
        }
        if (!formData.description.trim()){
            return 'course description is required'
        }
        if (formData.price===''||Number(formData.price)<0){
            return 'please enter a valid course price'
        }
        if (!formData.estimated_duration||Number(formData.estimated_duration)<=0){
            return 'please enter a valid course duration'
        }
        if (modules.length===0){
            return 'add at least one module'
        }
        for (let moduleIndex=0;moduleIndex<modules.length;moduleIndex++){
            const module=modules[moduleIndex]
            if (!module.title.trim()){
                return `module ${moduleIndex+1} needs a title`
            }
            if (module.lessons.length===0){
                return `module ${moduleIndex+1} needs at least one lesson`
            }
            for (let lessonIndex=0;lessonIndex<module.lessons.length;lessonIndex++){
                const lesson=module.lessons[lessonIndex]
                if (!lesson.title.trim()){
                    return `lesson ${lessonIndex+1} in module ${moduleIndex+1} needs a title`
                }
                if (!lesson.content.trim()){
                    return `lesson ${lessonIndex+1} in module ${moduleIndex+1} needs content`
                }
            }
        }
        return null
    }
    const handleSubmit=async (event)=>{
        event.preventDefault()
        setError('')
        setSuccess('')
        const ValidationError=validateForm()
        if (ValidationError){
            setError(ValidationError)
            window.scrollTo({
                top:0,
                behavour:'smooth',
            })
            return
        }
        try{
            setSaving(true)
            const data=new FormData()
            data.append('title',formData.title.trim())
            data.append('slug',formData.slug.trim())
            data.append('description',formData.description.trim())
            data.append('category',formData.category)
            data.append('level',formData.level)
            data.append('price',formData.price)
            data.append('estimated_duration',formData.estimated_duration)
            const curriculum=modules.map(
                (module,moduleIndex)=>({
                    title:module.title.trim(),
                    description:module.description?.trim()||'',
                    order:moduleIndex+1,
                    lessons:module.lessons.map(
                        (lesson,lessonIndex)=>({
                            title:lesson.title.trim(),
                            content:lesson.content.trim(),
                            order:lessonIndex+1,
                        })
                    )
                })
            )
            data.append('modules',JSON.stringify(curriculum))
            if (formData.thumbnail){
                data.append('thumbnail',formData.thumbnail)
            }
            const response=await mentorApi.patch(
                `/courses/mentor/courses/${courseId}/edit`,
                data,
                {
                    headers:{
                        'Content-Type':'multipart/form-data'
                    }
                }
            )
            setCourse(response.data)
            setSuccess(course?.status==='PUBLISHED'?'course changes submitted for admin review':'course updated successfully')
            window.scrollTo({
                top:0,
                behaviour:'smooth',
        })
        await fetchCourse()
        }catch(err){
            console.error(
                err
            )
            const responseData=err.response?.data
            let message=responseData?.error||responseData?.detail||'unable to update course'
            if (typeof responseData==='object'&&!responseData.error&&!responseData.detail){
                message=Object.entries(responseData).map(([key,value])=>`${key}:${Array.isArray(value)?value.join(', '):value}`).join(' | ')
            }
            setError(message)
            window.scrollTo({
                top:0,
                behaviour:'smooth',
            })
        }finally{
            setSaving(false)
        }
    }
    if (loading){
        return (
            <div className="edit-course-page">

                <div className="container-fluid px-4 py-5">

                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        ></div>

                        <p className="text-muted mt-3 mb-0">
                            Loading course...
                        </p>

                    </div>

                </div>

            </div>
        )
    }
    if (error && !course){
        return (
            <div className="edit-course-page">

                <div className="container-fluid px-4 py-5">

                    <div className="alert alert-danger">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {error}
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>

                </div>

            </div>
        )
    }
    return (
        <div className="edit-course-page">

            <div className="container-fluid px-4 px-lg-5 py-4">

                <EditCourseHeader
                    course={course}
                />

                {error && (
                    <div className="alert alert-danger alert-dismissible">

                        <i className="bi bi-exclamation-circle me-2"></i>

                        {error}

                        <button
                            type="button"
                            className="btn-close"
                            onClick={() =>
                                setError("")
                            }
                        ></button>

                    </div>
                )}

                {success && (
                    <div className="alert alert-success alert-dismissible">

                        <i className="bi bi-check-circle me-2"></i>

                        {success}

                        <button
                            type="button"
                            className="btn-close"
                            onClick={() =>
                                setSuccess("")
                            }
                        ></button>

                    </div>
                )}

                {course?.status === "PUBLISHED" && (
                    <div className="alert alert-warning border-0 shadow-sm">

                        <div className="d-flex gap-3">

                            <i className="bi bi-info-circle fs-5"></i>

                            <div>

                                <div className="fw-semibold">
                                    Changes require admin review
                                </div>

                                <div className="small mt-1">
                                    This course is currently published.
                                    Saving changes will submit the course
                                    for admin review before it can be
                                    published again.
                                </div>

                            </div>

                        </div>

                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="row g-4">

                        {/* Main content */}
                        <div className="col-12 col-xl-9">

                            <CourseBasicInfo
                                formData={formData}
                                categories={categories}
                                onChange={handleBasicChange}
                                onThumbnailChange={
                                    handleThumbnailChange
                                }
                            />

                            <CourseCurriculumEditor
                                modules={modules}
                                onModuleChange={
                                    handleModuleChange
                                }
                                onLessonChange={
                                    handleLessonChange
                                }
                                onAddModule={addModule}
                                onAddLesson={addLesson}
                                onRemoveLesson={
                                    removeLesson
                                }
                                onRemoveModule={
                                    removeModule
                                }
                            />

                        </div>

                        {/* Sidebar */}
                        <div className="col-12 col-xl-3">

                            <div className="card border-0 shadow-sm edit-course-card sticky-xl-top"
                                style={{
                                    top: "90px"
                                }}
                            >

                                <div className="card-body p-4">

                                    <h6 className="fw-bold mb-3">
                                        Course Actions
                                    </h6>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mb-2"
                                        disabled={saving}
                                    >

                                        {saving ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                ></span>

                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check2-circle me-2"></i>
                                                Save Changes
                                            </>
                                        )}

                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary w-100"
                                        disabled={saving}
                                        onClick={() =>
                                            navigate(-1)
                                        }
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default EditCourse