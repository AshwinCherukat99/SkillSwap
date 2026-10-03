import api from "./api";

const paymentApi={
    createCourseOrder:(courseId)=>{
        return api.post(
            '/payments/course/create_order/',
            {
                course_id:courseId
            }
        )
    },
    verifyCoursePayment:(data)=>{
        return api.post(
            '/payments/course/verify/',
            data
        )
    }
}

export default paymentApi