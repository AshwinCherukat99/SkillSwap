import {createSlice} from '@reduxjs/toolkit'

const initialState={
    posts:[],
    loading:false,
    error:null,
}

const postsSlice=createSlice({
    name:'posts',
    initialState,
    reducers:{
        setPosts:(state,action)=>{
            state.posts=action.payload
        },
        addPost:(state,action)=>{
            state.posts.unshift(action.payload)
        },
        removePost:(state,action)=>{
            state.posts=state.posts.filter(
                (post)=>post.id!==action.payload
            )
        },
        updatePost:(state,action)=>{
            const index=state.posts.findIndex(
                (post)=>post.id===action.payload.id
            ) 
            if (index!==-1){
                state.posts[index]=action.payload
            }
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
        },
        clearError:(state)=>{
            state.error=null
        },
    },
})

export const {
    setPosts,
    addPost,
    removePost,
    updatePost,
    setLoading,
    setError,
    clearError,
}=postsSlice.actions

export default postsSlice.reducer