import { createSlice } from "@reduxjs/toolkit";



const initialState = []
const messageSlice = createSlice({
    name:'messages',
    initialState,
    reducers:{
        add(state,action){
            state.push(action.payload)
        }
    }
})

export const {add} = messageSlice.actions
export default messageSlice.reducer