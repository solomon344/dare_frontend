import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    isAuthenticated:false,
}

const UserSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        change(state,action){
            const data = action.payload.data || {}
            state.data = data
            state.isAuthenticated = action.payload.isAuthenticated
        }
    }
})

export default UserSlice.reducer
export const {change} = UserSlice.actions