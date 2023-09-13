import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    notification : {
        message : '',
        type : '',
        open : false
    }
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers : {
        showNotification: (state, action) => {
            state.notification = {
                message : action.payload.message,
                type : action.payload.type,
                open: action.payload.open
            }
        }
    }
})

export const messageActions = messageSlice.actions

export default messageSlice