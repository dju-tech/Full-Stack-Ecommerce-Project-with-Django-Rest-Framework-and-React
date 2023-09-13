import {useState, useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Nav from '../Components/Nav.jsx'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useCookies } from 'react-cookie'
import { useSelector} from 'react-redux'

axios.defaults.withCredentials = true;

const Checkout = () => {
    const [inputs, setInputs] = useState({})
    const [loading, setLoading] = useState(false)

    const cart_id = useSelector(state => state.cart.cartId)

    const [token, setToken] = useCookies(['authToken'])

    const items = useSelector(state => state.cart.cartItems)
    const orderTotal = useSelector(state => state.cart.cartTotal)


    const handleChange = e => {
        const name = e.target.name
        const value = e.target.value
        setInputs(values => ({...values, [name] : value}))
    }

    const handleSubmit = e => {
        setLoading(true)
        e.preventDefault()
        const { first_name, last_name, email, phone_number, country, state, city, postal_code, delivery, payment_type} = inputs
        
        const config = {
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Token ${token['authToken']}`
            }
        }

        axios.post(`http://localhost:8000/api/v1/checkout/?cart_id=${cart_id}`, {
            first_name,
            last_name,
            email,
            phone_number,
            country,
            state,
            city,
            postal_code,
            delivery,
            payment_type
        }, config)
        .then(res => {
            const paymentUrl =  res.data['redirect_link']
            window.location.href = paymentUrl
        })
        .catch(e => console.log(e))
    }

    return (
        <>
            <Nav />
            <div className="padding-general navDistance">
                <Row>
                    <Col className='mb-5 col-7'>
                    <Form className='checkout-form' onSubmit={handleSubmit}>
                        <div className='p-4'>
                            <h3 className='mb-3'>Personal Information</h3>
                            
                                <div className='row mb-3'>
                                <div className='col'>
                                    <Form.Group>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" name="first_name" value={inputs.first_name || ""} onChange={handleChange}/>
                                    </Form.Group>
                                </div>
                                <div className='col'>
                                    <Form.Group>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" name="last_name" value={inputs.last_name || ""} onChange={handleChange} />
                                    </Form.Group>
                                </div>
                                </div>
                                <div className='row mb-3'>
                                    <div className='col'>
                                        <Form.Group>
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control type="email" name="email" value={inputs.email || ""} onChange={handleChange} />
                                        </Form.Group>
                                    </div>
                                    <div className='col'>
                                        <Form.Group>
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text" name="phone_number" value={inputs.phone_number || ""} onChange={handleChange} />
                                        </Form.Group>
                                    </div>
                                </div>
                        </div>
                        <div className='mt-3 p-4'>
                            <h2 className='mb-3'>Shipping Information</h2>
                            <div className='row mb-3'>
                                <div className='col'>
                                    <Form.Group>
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control type="text" name="country" value={inputs.country || ""} onChange={handleChange} />
                                    </Form.Group>
                                </div>
                                <div className='col'>
                                    <Form.Group>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control type="text" name="state" value={inputs.state || ""} onChange={handleChange} />
                                    </Form.Group>
                                </div>
                            </div>
                            
                            <div className='row mb-3'>
                                <div className='col'>
                                    <Form.Group>
                                    <Form.Label>Town/City</Form.Label>
                                    <Form.Control type="text" name="city" value={inputs.city || ""} onChange={handleChange} />
                                    </Form.Group>
                                </div>
                                <div className='col'>
                                    <Form.Group>
                                    <Form.Label>Postal Code</Form.Label>
                                    <Form.Control type="text" name="postal_code" value={inputs.postal_code || ""} onChange={handleChange} />
                                    </Form.Group>
                                </div>
                            </div>
                            <Form.Group>
                                <Form.Label>Delivery Address</Form.Label>
                                <Form.Control as="textarea" rows={3} value={inputs.delivery || ""} name='delivery' onChange={handleChange} />
                            </Form.Group>                              
                        </div>
                        <div className='p-4'>
                            <h2 className='mb-3'>Payment Information</h2>
                            <Form.Group>
                                <Form.Label>Payment Type</Form.Label>
                                <Form.Select value={inputs.payment_type || ""} name='payment_type' onChange={handleChange}>
                                    <option value=""  disabled>Select payment method</option>
                                    <option value="card">Card</option>
                                    <option value="banktransfer">Bank Transfer</option>
                                    <option value="cashondelivery">Cash on delivery</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <div className='px-4'>
                            <button type="submit" className="btn mt-3 purchase-btn">{ loading ? 'Please wait....' : 'Complete Purchase'}</button>
                        </div>

                        </Form>
                    </Col>
                    <Col className=''>
                        <div className='border p-4'>
                            <h3 className='mb-3'>Order Summary</h3>
                            {
                            items.map(item => {
                                return (
                                    <div key={item.id} className='d-flex align-items-center justify-content-between mb-3'>
                                        <div className='d-flex gap-2'>
                                            <figure className='figure order-fig'>
                                                <img src={`http://localhost:8000${item.product.image_url}`} className='img-fluid figure-img' />
                                            </figure>
                                            <div className="fig-text">
                                                <h6>{item.product.name}</h6>
                                                <p>Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h5>${item.total_price}</h5>
                                        </div>
                                    </div>
                                )
                            })
                            }

                            <div className='d-flex align-items-center justify-content-between mb-3'>
                                <h5>Shipping:</h5>
                                <h5>Free</h5>
                            </div>
                            <div className='d-flex align-items-center justify-content-between mb-3'>
                                <h5>SubTotal:</h5>
                                <h5>${orderTotal}</h5>
                            </div>
                            <Link to='/cart'>
                                <button type="submit" className="btn mt-3 modify-btn">Modify Cart</button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Checkout;