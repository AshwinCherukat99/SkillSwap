import {API_BASE_URL} from '../config'

const getAccountType=(token)=>{
    if (!token) return null
    try{
        const payload=token.split('.')[1]
        const normalized=payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      const decoded=JSON.parse(atob(normalized))
      if (decoded.account_type==='MENTOR'||decoded.mentor_id){
        return 'MENTOR'
      }
      if (decoded.user_id) return 'USER'
      return null
    }catch{
        return null
    }
}

const isTokenExpired=(token)=>{
        try{
            const payload=JSON.parse(
                atob(token.split('.')[1].replace(/-/g, "+").replace(/_/g, "/"))
            )
            return !payload.exp||payload.exp<=Date.now()/1000+15
        }catch{
            return true
        }
    }

async function getValidVideoAccessToken(){
    const mentorToken=localStorage.getItem('mentor_access_token')
    const userToken=localStorage.getItem('access_token')
    const mentorType=getAccountType(mentorToken)
    const userType=getAccountType(userToken)
    const accountType=
    mentorType==='MENTOR'?'MENTOR':
    userType==='USER'?'USER':
    null
    if (!accountType){
        throw new Error('no valid user or mentor access token found')
    }
    const accessKey=
    accountType==='MENTOR'?'mentor_access_token':'access_token'
    const refreshKey=
    accountType==='MENTOR'?'mentor_refresh_token':'refresh_token'
    let accessToken=localStorage.getItem(accessKey)
    if (accessToken&&!isTokenExpired(accessToken)){
        return accessToken
    }
    const refreshToken=localStorage.getItem(refreshKey)
    if (!refreshToken){
        throw new Error('your session has expired. please log in again.')
    }
    const response=await fetch(`${API_BASE_URL}/auth/token/refresh/`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({refresh:refreshToken})
    })
    if (!response.ok){
        throw new Error('could not refresh your session. please log in again')
    }
    const data=await response.json()
    accessToken=response.access
    if (!accessToken){
        throw new Error('token refresh response did not contain an access token')
    }
    localStorage.setItem(accessKey,accessToken)
    return accessToken
}

export default getValidVideoAccessToken