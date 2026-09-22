import axios from 'axios'

const adminApi=axios.create({
    baseURL:'http://127.0.0.1:8000/api'
})
adminApi.interceptors.request.use(
    (config)=>{
        const accessToken=localStorage.getItem('admin_access_token')
        if (accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

export default adminApi