import axios from 'axios'

const mentorApi=axios.create({
    baseURL:"http://127.0.0.1:8000/api",
    headers:{
        "Content-Type":"application/json",
    },
})

mentorApi.interceptors.request.use(
    (config)=>{
        const accessToken=localStorage.getItem('mentor_access_token')
        if (accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

export default mentorApi