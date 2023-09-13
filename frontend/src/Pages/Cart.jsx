import React, {useReducer, useState, useEffect, useContext} from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import Nav from '../Components/Nav.jsx'
import '../Styles/style.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductCard from '../Components/productCard.jsx'
import Footer from '../Components/Footer.jsx'
import CartItem from '../Components/CartItem.jsx'
import Message from '../Components/Message.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { cartActions } from '../Store/cartSlice.js'
import { useCookies } from 'react-cookie'


axios.defaults.withCredentials = true;


const Cart = () => {

	const [isLoggedIn, setIsLoggedIn] = useState(null)
	const [token] = useCookies(['authToken'])
	const navigate = useNavigate()

	useEffect(() => {
		console.log(token)
		if (token['authToken'] !== undefined){
			setIsLoggedIn(true)
		}else{
			setIsLoggedIn(false)
		}
	}, [])

	const handleProceed = () => {
		if (isLoggedIn){
			navigate('/checkout')
		}else{
			localStorage.setItem('next', 'checkout')
			navigate('/auth')
		}
	}

	const cartTotal = useSelector(state => state.cart.cartTotal)
	const cartQuantity = useSelector(state => state.cart.cartQuantity)
	const cartItems = useSelector((state) => state.cart.cartItems)
	

	return (
		<div>
			<Nav/>
			<div className='padding-general navDistance'>
				<h1 className='shop-h1'>
					Shopping Cart ({cartQuantity})
				</h1>
				<div className='mt-4 py-2 border-bottom bread-crumb'>
					<ul className='p-0'>
						<li><a>Home</a></li>
						<li><a>Shop</a></li>
						<li><a>Shopping Cart</a></li>
					</ul>
				</div>
			</div>	
			{ 
				 cartItems.length !== 0 &&
			<Row className='padding-general cartProductRow'>
				<Col className='col-12 col-lg-8'>
				<div className='cart-product-content'>
					<table className='table table-responsive mx-auto'>
						<thead>
							<tr>
							  <th scope="col" className='text-muted thResize'>Product</th>
						      <th scope="col" className='text-muted thResize'>Price</th>
						      <th scope="col" className='text-muted thResize'>Quantity</th>
						      <th scope="col" className='text-muted thResize'>Total</th>
							  <th></th>
							</tr>
						</thead>
						<tbody >
							{
				
								cartItems.map(item => {
									return (
										<CartItem key={item.id} productId={item.product.id} name={item.product.name} imageUrl={item.product.image_url} price={item.product.price} quantity={item.quantity} totalPrice={item.total_price}  />
									)
								}) 							
								
							}
						</tbody>
					</table>
					
				</div>
		
				</Col>
	
				<Col className='col-12 col-lg-4'>
					<div className='border p-4'>
						<div className='border-bottom py-1 mb-2'>
							<h6 className='text-muted fwHundred'>
								Cart Total 
							</h6>
						</div>
						<div className='border-bottom mb-2 py-1 d-flex justify-content-between align-items-center'>
							<h6 className='text-muted fwHundred'>
								Sub-Total
							</h6>
							<h6 className='priceBold'>
								${ cartTotal }
							</h6>
						</div>
						<div className='border-bottom  py-1 d-flex justify-content-between align-items-center'>
							<h6 className='text-muted fwHundred'>
								Shipping Fee
							</h6>
							<h6>
								Free
							</h6>
						</div>

						<button className='proceedBtn' onClick={handleProceed}>PROCEED TO CHECKOUT</button>
			
					</div>
					<div className='px-4 mt-3'>
						<Link to='/shop'>
							<button className='continueBtn'>CONTINUE SHOPPING</button>
						</Link>
					</div>
				</Col>
			</Row>
			}
			{
				cartItems.length === 0 &&
				<div className='my-5 d-flex justify-content-center align-items-center w-100 h-100'>
					<h4>Your Cart is Empty</h4>
				</div>
			}
				
				
			<Footer />
		</div>
	)
}

export default Cart;