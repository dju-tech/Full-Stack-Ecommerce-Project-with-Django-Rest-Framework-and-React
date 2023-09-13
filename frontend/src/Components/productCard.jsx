import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../Styles/style.css'
import {useState, useContext} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import ApiService from '../ApiService/ApiService'
import Message from './Message'
import { useSelector, useDispatch } from 'react-redux'
import { cartActions } from '../Store/cartSlice'
import { messageActions } from '../Store/messageSlice'
import { useCookies } from 'react-cookie'

axios.defaults.withCredentials = true;

const ProductCard = ({product_id, productimagesrc, productprice, producttitle}) => {

	const dispatch = useDispatch()
	const cart_id = useSelector(state => state.cart.cartId)

	const [token] = useCookies(['authToken'])

	const [showFavDiv, setShowFavDiv] = useState(false);

	const handleMouseEnter = () => {
		setShowFavDiv(true);
	}

	const handleMouseLeave = () => {
		setShowFavDiv(false);
	}

	const addToCart = async (e, product_id, quantity=1) => {
		
		e.preventDefault()
		dispatch(messageActions.showNotification({
			open : true,
			message : 'Sending Request',
			type : 'warning'
		}))
		try{
			console.log(token['authToken'])
			const response = await ApiService.addToCart(token, product_id, quantity, cart_id)
			console.log(response.data)
			dispatch(messageActions.showNotification({
				open : true,
				message : 'Item added successfully',
				type: 'success'
			}))
			dispatch(cartActions.addToCart(response.data))
			

		}catch(e){
			dispatch(messageActions.showNotification({
				open : true,
				message : 'Item not added to cart successfully',
				type: 'error'
			}))
			console.log(e)
		}
	}

	return (
		<Col className="col-12 col-md-4 col-lg-3 mb-3">
		
			<Card className="product-card border border-light" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
	            <figure className="figure position-relative">
	            <Link to={`/product_detail/${product_id}`}>
	                <img className="figure-img img-fluid w-100" src={productimagesrc} alt="product image" />
	            </Link>
	                <div className={`fav-div ${showFavDiv ? 'active': ''}`}>
						<a href="">
	                		<i className="bx bx-heart" style={{color:'#fec80e'}}></i>
						</a>
	                </div>
	                <div className={`fav-div ${showFavDiv ? 'active': ''}`} style={{marginTop: '40px'}}>
						<a href="">
	                		<i className="bx bx-share" style={{color:'#fec80e'}}></i>
						</a>
	                </div>
	            </figure>
	            <div className="details-container">
	                <span className="text-muted text-center d-block">
	               		{producttitle}
	                </span>
	                <span className="text-center fw-bold d-block">
	                    ${productprice}
	                </span>
	                <div className="rating-star d-flex justify-content-center align-items-center gap-1">
	                    <i className='bx bxs-star' style={{color:'#fec80e'}}></i>
	                    <i className='bx bxs-star' style={{color:'#fec80e'}}></i>
	                    <i className='bx bxs-star' style={{color:'#fec80e'}}></i>
	                    <i className='bx bxs-star' style={{color:'#fec80e'}}></i>
	                    <i className='bx bxs-star-half' style={{color:'#fec80e'}}></i>
	                </div>
	                <a  className={`addBtn w-100 d-block text-center ${showFavDiv ? 'active' : ''}`} onClick={e => addToCart(e, product_id, 1)}>Add to Cart</a>
	            </div>
	        </Card>
        </Col>
	)
}

export default ProductCard;