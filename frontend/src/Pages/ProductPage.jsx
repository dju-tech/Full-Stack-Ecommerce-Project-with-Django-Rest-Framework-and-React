import React, {useEffect, useState, useReducer, useContext} from "react";
import Nav from "../Components/Nav.jsx"
import Footer from "../Components/Footer.jsx"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../Styles/style.css'
import ProductCard from '../Components/productCard'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import ApiService from '../ApiService/ApiService.jsx'
import Message from "../Components/Message.jsx";
import { useSelector, useDispatch } from "react-redux";
import { messageActions } from "../Store/messageSlice.js";
import { cartActions } from "../Store/cartSlice.js";
import { useCookies } from "react-cookie"

axios.defaults.withCredentials = true;



const ProductPage = () => {

	const dispatchAction = useDispatch()
	const cart_id = useSelector(state => state.cart.cartId)

	const params = useParams();
	const [product, setProduct] = useState({});

	const [token] = useCookies(['authToken'])

	useEffect(() => {
		axios.get(`http://localhost:8000/api/v1/product_detail/${params.product_id}/`, {
			headers: {
				'Content-Type' : 'application/json'
			}
		})
		.then(response => { 
			setProduct(response.data)
		})
		.catch(err => { console.log(err) })

	}, [])



	const intitialState = { count: 1}
	const reducer = (state, action) => {
		switch (action.type){
		case 'increment':
			return {count: state.count + 1};
		case 'decrement':
			if (state.count == 1) return state 
			return {count: state.count - 1};
		default:
			return state
		}
	}

	const [state, dispatch] = useReducer(reducer, intitialState)


	const addToCart = async ()  => {

		dispatchAction(messageActions.showNotification({
			open : true,
			message : 'Sending Request',
			type: 'warning'
		}))
		try{
			const product_id = product.id
			const quantity = state.count
			const response = await ApiService.addToCart(token, product_id, quantity, cart_id)
			console.log(response.data)
			dispatchAction(cartActions.addToCart(response.data))
			dispatchAction(messageActions.showNotification({
				open : true,
				message : 'Item added to cart successfully',
				type: 'success'
			}))
		}catch(e){
			console.log(e)
			dispatchAction(messageActions.showNotification({
				open : true,
				message : 'Request Failed',
				type: 'error'
			}))
		}
	}



	return (
		<>
			<Nav />
			<div className="padding-general navDistance">
				<Row>
					<Col className='productPicHeight col-4'>
						<img src={`http://localhost:8000${product.image_url}`} className='productPic rounded' alt='product picture' />
					</Col>
					<Col className="ms-5">
						<h1 className='product-h1 mb-4'>
							{product.name}
						</h1>
						<h2 className='mb-4'>
							${product.price}
						</h2>
						<div className='qtyDiv mb-4'>
							<p className='p-0 m-0 me-4'>Qty:</p>
							<button className='qtyBtn' onClick={() => dispatch({type:'decrement'})}>
								<i className='bx bx-minus'></i>
							</button>
							<input type='number' className='form-control' value={state.count} onChange={e => setQuantity(e.target.value)} />
							<button className='qtyBtn' onClick={() => dispatch({type:'increment'})}>
								<i className='bx bx-plus'></i>
							</button>
						</div>
						<div className='col-5'>
							<button className="addBtn w-100 d-block text-center active" onClick={addToCart}>Add to Cart</button>
						</div>
		
					</Col>
				</Row>
			</div>
			<div className="padding-general my-5">
				<h4 className="border-bottom">
					Description
				</h4>
				<div>
					<p>
						{product.description}
					</p>
				</div>
			</div>
            
			<Footer />
		</>
	)
}

export default ProductPage;