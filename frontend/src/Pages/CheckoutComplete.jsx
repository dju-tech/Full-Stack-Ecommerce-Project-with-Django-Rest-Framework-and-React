import axios from 'axios'
import {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch } from 'react-redux'
import { cartActions } from '../Store/cartSlice'
import {Link} from 'react-router-dom'

const CheckoutComplete = () => {

    const [orderComplete, setOrderComplete] = useState([])

    const [token, setToken] = useCookies(['authToken'])

    const dispatch = useDispatch()

    const urlString = window.location.href
    const url = new URL(urlString)
    const searchParams = url.searchParams
    const status = searchParams.get('status')
    const tx_ref = searchParams.get('tx_ref')
    const transaction_id = searchParams.get('transaction_id')

    useEffect(() => {
        const config = {
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Token ${token['authToken']}`
            }
        }
        axios.get(`http://localhost:8000/api/v1/checkout/success/${status}/${tx_ref}/${transaction_id}`, config)
        .then(res => {
            setOrderComplete(res.data)
            localStorage.clear()
        })
        .catch(e => console.log(e))
    }, [])


    const goHome = () => {
        window.location.href = '/'
    }

    return (
        <>
            <div className='d-flex justify-content-center align-items-center checkoutComplete'>
                <div className='border border-1 p-3'>
                    <div>
                        <h3 className='mb-3'>Your Order Was Placed Successfully</h3>
                    </div>
                    {
                        orderComplete.map(order => {
                            return (
                                <div key={order.id} className='d-flex align-items-center justify-content-between mb-2'>
                                <div className='d-flex gap-2 align-items-center'>
                                    <figure className='figure order-fig'>
                                        <img src={`http://localhost:8000${order.image_url}`} className='img-fluid figure-img' />
                                    </figure>
                                    <div className="fig-text">
                                        <h6>{order.name}</h6>
                                        <p>Qty: {order.quantity}</p>
                                    </div>
                                </div>
                                <div>
                                    <h5>${order.price}</h5>
                                </div>
                            </div>
                            )
                        })
                    }
                    <div>
                        
                        <button className='proceedBtn' onClick={goHome}>Return to homepage</button>
                      
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutComplete