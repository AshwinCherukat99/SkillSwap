import React,{useState,useEffect,useCallback,useRef} from 'react'

import {useParams,useNavigate} from 'react-router-dom'

import AssessmentHeader from '../../../components/user/ai_assessment/AssessmentHeader'
import AssessmentReview from '../../../components/user/ai_assessment/AssessmentReview'     
import AssessmentProgress from '../../../components/user/ai_assessment/AssessmentProgress'
import QuestionCard from '../../../components/user/ai_assessment/QuestionCard'
import QuestionNavigator from '../../../components/user/ai_assessment/QuestionNavigator'
import AssessmentTimer from '../../../components/user/ai_assessment/AssessmentTimer'

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
    const submissionStarted=useRef(false)
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
            [String(question.id)]:answer,
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
    const handleSubmit=useCallback(async ()=>{
        if (submitting||submissionStarted.current||!assessment){
            return
        }
        try{
            setSubmitting(true)
            setError('')
            console.log('========== FRONTEND SUBMISSION ==========')
        console.log('ASSESSMENT ID:', assessment.id)
        console.log('QUESTIONS:', questions)
        console.log('ANSWERS STATE:', answers)
            const submittedAnswers=questions.map(question=>({
                question_id:question.id,
                answer:answers[String(question.id)]??''
            }))
            console.log(
            'SUBMITTED ANSWERS:',
            submittedAnswers
        )

        console.log(
            'ANSWERS JSON:',
            JSON.stringify({
                answers: submittedAnswers,
            }, null, 2)
        )

        console.log('==========================================')
            const response=await api.post(
                `/courses/assessments/${assessment.id}/submit/`,
                {
                    answers:submittedAnswers
                }
            )
        console.log('post succeeded:',response.status)
        console.log('full response:',response.data)
        const assessmentData=response.data.assessment
        const resultData=response.data.result
        console.log('assessment:',assessmentData)
        console.log('result:',resultData)
        navigate(`/courses/${courseId}/assessment/${assessment.id}/result`,{
            state:{assessment:assessmentData,result:resultData},
        })
        console.log('navigate called')
            console.log('assessment submitted successfully:',response.data)
        }catch(error){
            console.error('failed to submit assessment-',error)
            setError(error.response?.data?.error||'failed to submit assessment')
            submissionStarted.current=false
        }finally{
            setSubmitting(false)
        }
    },[submitting,assessment,questions,answers,api,navigate,courseId])
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

            <div className="container-fluid px-4 px-lg-5 pt-3">
    <div className="d-flex justify-content-end">
        <AssessmentTimer
            deadline={assessment.deadline}
            onTimeUp={handleSubmit}
            disabled={submitting}
        />
    </div>
</div>

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