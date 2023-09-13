import React from 'react'
import { Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { messageActions } from '../Store/messageSlice'

const Message = ({type, message}) => {

    const notification = useSelector(state => state.message.notification)
    const dispatch = useDispatch()


    const handleClose = () => {
        dispatch(messageActions.showNotification({
            open : false
        }))
    }

    return (
        <div>
            {
                notification.open && <Alert onClose={handleClose} severity={type}>{message}</Alert>
            }
        </div>
    )
}

export default Message;