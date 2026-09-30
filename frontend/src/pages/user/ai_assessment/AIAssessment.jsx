import React,{useState,useEffect} from 'react'

import {useParams,useNavigate} from 'react-router-dom'

import AssessmentHeader from '../../../components/user/ai_assessment/AssessmentHeader'
import AssessmentReview from '../../../components/user/ai_assessment/AssessmentReview'     
import AssessmentProgress from '../../../components/user/ai_assessment/AssessmentProgress'
import QuestionCard from '../../../components/user/ai_assessment/QuestionCard'
import QuestionNavigator from '../../../components/user/ai_assessment/QuestionNavigator'

import api from '../../../services/api'

const AIAssessment=()=>{
    const {courseId}=useParams()
    const navigate=useNavigate()
    const [assessment,setAssessment]=useState(null)
    const [currentQuestion,setCurrentQuestion]=useState(0)
    const [answers,setAnswers]=useState({})
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState('')
    const [reviewMode,setReviewMode]=useState(false)
    const [submitting,setSubmitting]=useState(false)
    useEffect(()=>{
        startAssessment()
    },[courseId])
    const startAssessment=async ()=>{
        try{
            setLoading(true)
            setError('')
            const response=await api.post(
                `/courses/${courseId}/assessment/start/`
            )
            setAssessment(response.data)
        }catch(error){
            console.error('failed to start assessment:',error)
            setError(error.response?.data?.error||'failed to start assessment.')
        }finally{
            setLoading(false)
        }
    }
    const questions=assessment?.questions||[]
    const question=questions[currentQuestion]
    const handleAnswer=(answer)=>{
        if (!question){
            return
        }
        setAnswers(previous=>({
            ...previous,
            [question.id]:answer,
        }))
    }
    const goToQuestion=(index)=>{
        if (index>=0&&index<questions.length){
            setCurrentQuestion(index)
        }
    }
    const handleNext=()=>{
        if (currentQuestion<questions.length-1){
            setCurrentQuestion(previous=>previous+1)
        }
    }
    const handlePrevious=()=>{
        if (currentQuestion>0){
            setCurrentQuestion(previous=>previous-1)
        }
    }
    const handleReview=()=>{
        setReviewMode(true)
    }
    const handleBackToQuestions=()=>{
        setReviewMode(false)
    }
    const handleSubmit=async ()=>{
        try{
            setSubmitting(true)
            setError('')
            console.log('submitting assessment:',assessment.id)
            const response=await api.post(
                `/courses/assessments/${assessment.id}/submit/`
            )
            console.log('assessment submitted successfully:',response.data)
        }catch(error){
            console.error('failed to submit assessment-',error)
            setError(error.response?.data?.error||'failed to submit assessment')
        }finally{
            setSubmitting(false)
        }
    }
    if (loading){
        return (
            <div className="container py-5">

                <div className="d-flex justify-content-center align-items-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                </div>

            </div>
        )
    }
    if (error){
        return (
            <div className="container py-5">

                <div className="alert alert-danger">

                    {error}

                </div>

            </div>
        )
    }
    if (!assessment){
        return null
    }
    if (reviewMode){
        return (
                        <div className="assessment-page">

                <AssessmentHeader
                    assessment={assessment}
                />

                <AssessmentReview
                    questions={questions}
                    answers={answers}
                    onSelectQuestion={goToQuestion}
                    onBack={handleBackToQuestions}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                />

            </div>

        )
    }
    return (
        <div className="assessment-page">

            <AssessmentHeader
                assessment={assessment}
            />


            <AssessmentProgress
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
            />


            <main className="container-fluid px-4 px-lg-5 py-4">

                <div className="row g-4">


                    {/* Question */}

                    <div className="col-lg-8 col-xl-9">

                        <QuestionCard
                            question={question}
                            questionNumber={
                                currentQuestion + 1
                            }
                            answer={
                                answers[question?.id]
                            }
                            onAnswer={
                                handleAnswer
                            }
                        />


                        {/* Navigation */}

                        <div className="d-flex justify-content-between align-items-center mt-4">

                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4"
                                onClick={
                                    handlePrevious
                                }
                                disabled={
                                    currentQuestion === 0
                                }
                            >

                                <i className="bi bi-arrow-left me-2" />

                                Previous

                            </button>


                            {currentQuestion ===
                            questions.length - 1 ? (

                                <button
                                    type="button"
                                    className="btn btn-primary px-4"
                                    onClick={
                                        handleReview
                                    }
                                >

                                    Review Answers

                                    <i className="bi bi-arrow-right ms-2" />

                                </button>

                            ) : (

                                <button
                                    type="button"
                                    className="btn btn-primary px-4"
                                    onClick={
                                        handleNext
                                    }
                                >

                                    Next

                                    <i className="bi bi-arrow-right ms-2" />

                                </button>

                            )}

                        </div>

                    </div>


                    {/* Question Navigator */}

                    <div className="col-lg-4 col-xl-3">

                        <QuestionNavigator
                            questions={questions}
                            currentQuestion={
                                currentQuestion
                            }
                            answers={answers}
                            onSelectQuestion={
                                goToQuestion
                            }
                        />

                    </div>

                </div>

            </main>

        </div>
    )
}

export default AIAssessment