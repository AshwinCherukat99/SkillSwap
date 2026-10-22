import {createSlice} from '@reduxjs/toolkit' 

const storedUser=localStorage.getItem('user')
const storedAccessToken=localStorage.getItem('access_token')
const storedRefreshToken=localStorage.getItem('refresh_token')
const storedMentor=localStorage.getItem('mentor')
const storedMentorAccessToken=localStorage.getItem('mentor_access_token')
const storedMentorRefreshToken=localStorage.getItem('mentor_refresh_token')
const storedAdmin=localStorage.getItem('admin_user')
const storedAdminAccessToken=localStorage.getItem('admin_access_token')
const storedAdminRefreshToken=localStorage.getItem('admin_refresh_token')

const safeJSONParse = (value) => {
    if (!value || value === "undefined" || value === "null") {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch (error) {
        console.error("Invalid JSON in localStorage:", error);
        return null;
    }
};

const initialState={
    user:safeJSONParse(storedUser),
    accessToken:storedAccessToken,
    refreshToken:storedRefreshToken,
    isAuthenticated:!!storedAccessToken,
    mentor:safeJSONParse(storedMentor),
    mentorAccessToken:storedMentorAccessToken,
    mentorRefreshToken:storedMentorRefreshToken,
    isMentorAuthenticated:!!storedMentorAccessToken,
    admin:safeJSONParse(storedAdmin),
    adminAccessToken:storedAdminAccessToken,
    adminRefreshToken:storedAdminRefreshToken,
    isAdminAuthenticated:!!storedAdminAccessToken,
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
        },
        adminLogin:(state,action)=>{
            const {admin,accessToken,refreshToken}=action.payload
            state.admin=admin
            state.adminAccessToken=accessToken
            state.adminRefreshToken=refreshToken
            state.isAdminAuthenticated=true
            localStorage.setItem('admin_user',JSON.stringify(admin))
            localStorage.setItem('admin_access_token',accessToken)
            localStorage.setItem('admin_refresh_token',refreshToken)
        },
        adminLogout:(state)=>{
            state.admin=null
            state.adminAccessToken=null
            state.adminRefreshToken=null
            state.isAdminAuthenticated=false
            localStorage.removeItem('admin_user')
            localStorage.removeItem('admin_access_token')
            localStorage.removeItem('admin_refresh_token')
        }
    }
})

export const {
    login,
    logout,
    mentorLogin,
    mentorLogout,
    adminLogin,
    adminLogout,
    updateUser,
    updateAccessToken
}=authSlice.actions

export default authSlice.reducer