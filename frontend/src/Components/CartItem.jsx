import {useReducer, useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import ApiService from '../ApiService/ApiService'
import { useSelector, useDispatch } from 'react-redux'
import { messageActions } from '../Store/messageSlice'
import { cartActions } from '../Store/cartSlice'
import { useCookies } from 'react-cookie'

const CartItem = ({productId, name, imageUrl, price, quantity, totalPrice}) => {
    
    const dispatchAction = useDispatch()
    const cart_id = useSelector(state => state.cart.cartId)
    const [token] = useCookies(['authToken'])

    const handleDelete = async (productId) => {
        dispatchAction(messageActions.showNotification({
            open : true,
            message : 'Sending Request',
            type: 'warning'
        }))
        try{
            const response = await ApiService.deleteItem(token, productId, cart_id)
            console.log(response.data)
            dispatchAction(cartActions.deleteItem(response.data))
            dispatchAction(messageActions.showNotification({
                open : true,
                message : 'Item deleted successfully',
                type: 'success'
            }))

        }catch(e){
            dispatchAction(messageActions.showNotification({
                open : true,
                message : 'Item not deleted successfully',
                type: 'error'
            }))
            console.log(e)
        }
    }    
    const updateCart = async (productId, quantity) => {
        
        dispatchAction(messageActions.showNotification({
            open : true,
            message : 'Sending Request',
            type: 'warning'
        }))
        try{
            console.log(quantity)
            const response = await ApiService.updateCart(token, productId, quantity, cart_id)
            dispatchAction(cartActions.updateCart(response.data))
            dispatchAction(messageActions.showNotification({
                open : true,
                message : 'Cart updated successfully',
                type: 'success'
            }))
            
        }catch(e){
            dispatchAction(messageActions.showNotification({
                open : true,
                message : 'Request Failed',
                type: 'error'
            }))
            console.log(e)
        }
    }

    const intitialState = { count: quantity}
	const reducer = (state, action) => {
		switch (action.type){
		case 'increment':
			return {count: state.count + 1};
		case 'decrement':
			if (state.count == 1) return state 
			return {count: state.count - 1};
        case 'set':
            return {count: action.payload}
		default:
			return state
		}
	}

	const [state, dispatch] = useReducer(reducer, intitialState)



    
    useEffect(() => {
        updateCart(productId, quantity=state.count)
    }, [state.count])

    const handleChange = e => {
        const newValue = isNaN(e.target.value) || e.target.value === '' ? 1 : parseInt(e.target.value)
        dispatch({type: 'set', payload: newValue})
        // updateCart(productId, quantity=newValue)
    }

    return (
        <tr>
            <td className='align-middle d-flex align-items-center gap-2'>
                <figure className='cartProductPicture'>
                    <Link to={`/product_detail/${productId}`}>
                    <img src={`http://localhost:8000${imageUrl}/`} alt='product picture' />
                    </Link>
                </figure>
                <figcaption className="figure-caption text-nowrap">{name}</figcaption>
            </td>
            <td className='align-middle priceBold'>
                ${price}
            </td>
            <td className='align-middle'>
                <div className='qtyDiv'>
                    <button className='qtyBtn' onClick={() => dispatch({type:'decrement'})}>
                        <i className='bx bx-minus'></i>
                    </button>
                    <input type='number' className='form-control cartQuantity' min={1} value={state.count} onChange={e => handleChange(e)} />
                    <button className='qtyBtn' onClick={() => dispatch({type: 'increment'})}>
                        <i className='bx bx-plus'></i>
                    </button>
                </div>
            </td>
            <td className='align-middle priceBold'>
                ${totalPrice}
            </td>
            <td className='align-middle deleteItemBtn'>
                <i className='bx bx-x' onClick={() => handleDelete(productId)}></i>
            </td>
        </tr>
    )
}

export default CartItem;