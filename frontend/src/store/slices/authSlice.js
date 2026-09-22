import {createSlice} from '@reduxjs/toolkit' 

const storedUser=localStorage.getItem('user')
const storedAccessToken=localStorage.getItem('access_token')
const storedRefreshToken=localStorage.getItem('refesh_token')
const storedMentor=localStorage.getItem('mentor')
const storedMentorAccessToken=localStorage.getItem('mentor_access_token')
const storedMentorRefreshToken=localStorage.getItem('mentor_refresh_token')

const initialState={
    user:storedUser?JSON.parse(storedUser):null,
    accessToken:storedAccessToken,
    refreshToken:storedRefreshToken,
    isAuthenticated:!!storedAccessToken,
    mentor:storedMentor?JSON.parse(storedMentor):null,
    mentorAccessToken:storedMentorAccessToken,
    mentorRefreshToken:storedMentorRefreshToken,
    isMentorAuthenticated:!!storedMentorAccessToken,
} 

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        login:(state,action)=>{
            const {
                user,
                accessToken,
                refreshToken
            }=action.payload
            state.user=user
            state.accessToken=accessToken
            state.refreshToken=refreshToken
            state.isAuthenticated=true
            localStorage.setItem('user',JSON.stringify(user))
            localStorage.setItem('access_token',accessToken)
            localStorage.setItem('refresh_token',refreshToken)
        },
        logout:(state)=>{
            state.user=null
            state.accessToken=null
            state.refreshToken=null
            state.isAuthenticated=false
            localStorage.removeItem('user')
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        },
        updateUser:(state,action)=>{
            state.user={
                ...state.user,
                ...action.payload,
            }
            localStorage.setItem(
                "user",
                JSON.stringify(state.user)
            )
        },
        updateAccessToken:(state,action)=>{
            state.accessToken=action.payload
            localStorage.setItem('access_token',action.payload)
        },
        mentorLogin:(state,action)=>{
            const {
                mentor,
                accessToken,
                refreshToken
            }=action.payload
            state.mentor=mentor 
            state.mentorAccessToken=accessToken
            state.mentorRefreshToken=refreshToken
            state.isMentorAuthenticated=true 
            localStorage.setItem('mentor',JSON.stringify(mentor))
            localStorage.setItem('mentor_access_token',accessToken)
            localStorage.setItem('mentor_refresh_token',refreshToken)
        },
        mentorLogout:(state)=>{
            state.mentor=null
            state.mentorAccessToken=null
            state.mentorRefreshToken=null
            state.isMentorAuthenticated=false
            localStorage.removeItem('mentor')
            localStorage.removeItem('mentor_access_token')
            localStorage.removeItem('mentor_refresh_token')
        }
    }
})

export const {
    login,
    logout,
    updateUser,
    updateAccessToken
}=authSlice.actions

export default authSlice.reducer