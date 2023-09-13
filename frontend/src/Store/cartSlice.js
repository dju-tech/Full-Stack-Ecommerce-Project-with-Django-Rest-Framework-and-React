import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cartItems : [],
    cartTotal : 0,
    cartQuantity : 0,
    cartId : ''
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        set: (state, action) => {
            const cartData = action.payload
            state.cartItems = cartData['data']
            console.log(state.cartItems)
            state.cartTotal = cartData['cart_total']
            state.cartQuantity = cartData['cart_quantity']
            state.cartId = cartData['cart_id']
        },
        addToCart: (state, action) => {
            const newItem = action.payload['item_data']
            state.cartId = action.payload['cart_id']
            const existingItem = state.cartItems.find(item => item.id === newItem.id)
            if (existingItem === undefined){
                state.cartItems.push(newItem)
            }else{
                existingItem.total_price = newItem.total_price
                existingItem.quantity = newItem.quantity
            }
            let total = 0
            state.cartItems.forEach(item => {
                total += parseFloat(item.total_price)
            })
            state.cartQuantity = state.cartItems.length
            state.cartTotal = total.toFixed(2)
        },
        updateCart: (state, action) => {
            const newItem = action.payload
            const newCartItems = state.cartItems.map(item => {
                if (item.id === newItem.id){
                    return newItem
                }else{
                    return item
                }
            })
            state.cartItems = newCartItems
            let total = 0
            state.cartItems.forEach(item => {
                total += parseFloat(item.total_price)
            })
            state.cartQuantity = state.cartItems.length
            state.cartTotal = total.toFixed(2)
        },
        deleteItem: (state, action) => {
            const newItem = action.payload
            const newCartItems = state.cartItems.filter(item => {
                if (item.id === newItem.id) return false
                return true
            })
            state.cartItems = newCartItems
            state.cartQuantity = state.cartItems.length
            let total = 0
            state.cartItems.forEach(item => {
                total += parseFloat(item.total_price)
            })
            state.cartTotal = total.toFixed(2)
        }
    }
})

export default cartSlice

export const cartActions = cartSlice.actions