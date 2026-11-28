import axios from "axios";
import { API_BASE_URL } from "../config";

const refreshEndpoint=`${API_BASE_URL.replace(/\/$/, "")}/auth/token/refresh/`

export const setupAuthInterceptors=({
    api,
    accessTokenKey,
    refreshTokenKey,
    userKey,
    role
})=>{
    let refreshPromise=null
    api.interceptors.request.use(
        (config)=>{
            const accessToken=localStorage.getItem(accessTokenKey)
            if (accessToken){
                config.headers=config.headers||{}
                config.headers.Authorization=`Bearer ${accessToken}`
            }
            return config
        },
        (error)=>Promise.reject(error)
    )
    api.interceptors.response.use(
        (response)=>response,
        async (error)=>{
            const originalRequest=error.config
            if (
                error.response?.status!==401||
                !originalRequest||
                originalRequest._retry||
                originalRequest.url?.includes('token/refresh/')
            ){
                return Promise.reject(error)
            }
            originalRequest._retry=true
            const refreshToken=localStorage.getItem(refreshTokenKey)  
            if (!refreshToken){
                clearSession()
                return Promise.reject(error)
            } 
            try{
                if (!refreshPromise){
                    refreshPromise=axios.post(refreshEndpoint,{
                        refresh:refreshToken
                    })
                    .then((refreshResponse)=>{
                        const newAccessToken=refreshResponse.data.access
                        if (!newAccessToken){
                            throw new Error(
                                'refresh response did not contain an access token'
                            )
                        }
                        localStorage.setItem(accessTokenKey,newAccessToken)
                    if (refreshResponse.data.refresh){
                        localStorage.setItem(refreshTokenKey,refreshResponse.data.refresh)
                    }
                    return newAccessToken
                    }).catch((refreshError)=>{
                        clearSession()
                        throw refreshError
                    })
                    .finallly(()=>{
                        refreshPromise=null
                    })
                }
                const newAccessToken=await refreshPromise
                originalRequest.headers=originalRequest.headers||{}
                originalRequest.headers.Authorization=`Bearer ${newAccessToken}` 
                return api(originalRequest)
            }catch(refreshError){
                return Promise.reject(refreshError)
            }
        }
    )
    function clearSession(){
        localStorage.removeItem(accessTokenKey)
        localStorage.removeItem(refreshTokenKey)
        if (userKey){
            localStorage.removeItem(userKey)
        }
        window.dispatchEvent(
            new CustomEvent("auth:session-expired",{
                detail:{role}
            })
        )
    }
}