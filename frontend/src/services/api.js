import axios from 'axios'

const api=axios.create({
    baseURL:"http://127.0.0.1:8000/api"
})

api.interceptors.request.use(
    (config)=>{
        const accessToken=localStorage.getItem('access_token')
        console.log(
            "Request URL:",
            config.baseURL + config.url
        )
        if (accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response)=>{
        return response
    },
    async (error)=>{
        const originalRequest=error.config
        if (
            error.response?.status===401 && !originalRequest._retry
        ){
            originalRequest._retry=true
            const refreshToken=localStorage.getItem('refresh_token')
            if (!refreshToken){
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('user')
                return Promise.reject(error)
            }
            try{
                const refreshResponse=await axios.post(
                    "http://127.0.0.1:8000/api/auth/token/refresh/",
                    {
                        refresh:refreshToken,
                    }
                )
                const newAccessToken=refreshResponse.data.access
                localStorage.setItem('access_token',newAccessToken)
                if (refreshResponse.data.refresh){
                    localStorage.setItem('refresh_token',refreshResponse.data.refresh)
                }
                originalRequest.headers.Authorization=`Bearer ${newAccessToken}`
                return api(originalRequest)
            }catch(refreshError){
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('user')
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default api