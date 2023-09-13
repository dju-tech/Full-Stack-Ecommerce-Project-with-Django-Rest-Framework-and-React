import { useState, useEffect } from "react"
import Form from 'react-bootstrap/Form'
import ApiService from '../ApiService/ApiService.jsx'
import { useDispatch, useSelector } from 'react-redux'
import Message from "../Components/Message.jsx"
import { messageActions } from "../Store/messageSlice.js"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

const Auth = () => {

    const [token, setToken] = useCookies(['authToken'])
    const dispatch = useDispatch()
    const message = useSelector(state => state.message.notification)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLogin, setLogin] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        if(token['authToken']){
            const nextUrl = localStorage.getItem('next')
            if (nextUrl === null){
                navigate('/')
            }else{
                navigate('/checkout')
                localStorage.removeItem('next')
            }
        }
    }, [token])


    const handleLogin = async () => {
        console.log(username)
        console.log(password)
        try{
            const response = await  ApiService.handleLogin({username, password})
            dispatch(messageActions.showNotification({
                open : true,
                message : 'You have been logged in',
                type : 'success'
            }))
            console.log(response.data.token)
            setToken('authToken', response.data.token)
            
        }catch (e){
            dispatch(messageActions.showNotification({
                open : true,
                message : 'Login Failed',
                type : 'error'
            }))
            console.log(e)
        }
    }
 

    const handleRegister = () => {
    
        try{
            const response =  ApiService.handleRegister(username, password)
            dispatch(messageActions.showNotification({
                open : true,
                message : 'Sign Up Successful',
                type : 'success'
            }))
            console.log(response.data)
        }catch(e){
            
            dispatch(messageActions.showNotification({
                open : true,
                message : 'Sign Up Failed',
                type : 'error'
            }))
            console.log(e)
        }
    }

    return (
        <>
        { message.open && <Message type={message.type} message={message.message} /> }
            <div className="d-flex justify-content-center align-items-center checkoutComplete">
            <div className="col-4 col-sm-6">
                {
                    isLogin ? <h2 className="mb-4">Please Login</h2> : <h2 className="mb-4">Please Register</h2>
                }
    
                    <div>
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input className="form-control" type='text' id='username' value={username} onChange={e => setUsername(e.target.value)}  />
                        </div>
                    </div>
                    <div className='mt-3'>
                        <div className="form-group">
                            <label className="form-label" htmlFor='pwd'>Password</label>
                            <input className='form-control' type='password' id='pwd' value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        {
                            isLogin ? <button className="proceedBtn mt-4 authBtn" onClick={handleLogin}>Login</button> : <button className="proceedBtn mt-4 authBtn" onClick={handleRegister}>Register</button>
                        }
                    </div>
                    <div className="mt-3">
                    {
                        isLogin ? <p className='text-center'>Don't have an account, <span onClick={() => setLogin(false)} style={{cursor:"pointer"}}>Create one</span></p> : <p className="text-center">Have an account, <span onClick={() => setLogin(true)} style={{cursor:"pointer"}}>Login</span></p>
                    }
                    </div>
           
            </div>
            </div>
        </>
    )
}

export default Auth