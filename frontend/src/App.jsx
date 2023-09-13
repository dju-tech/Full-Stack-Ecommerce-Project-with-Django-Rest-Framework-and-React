import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import Home from './Pages/index.jsx';
import Cart from './Pages/Cart.jsx'
import Shop from './Pages/Shop.jsx'
import ProductPage from './Pages/ProductPage.jsx'
import Checkout from './Pages/Checkout.jsx'
import CheckoutComplete from './Pages/CheckoutComplete.jsx'
import Auth from './Pages/Auth.jsx'

function Router(){
    return(
        <CookiesProvider>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<Home/>} />
                    <Route exact path='/cart' element={<Cart/>} />
                    <Route exact path='/shop' element={<Shop />} />
                    <Route exact path='/product_detail/:product_id' element={<ProductPage/>} />
                    <Route exact path='/checkout' element={<Checkout />} />
                    <Route exact path='/checkout/success' element={<CheckoutComplete />} />
                    <Route exact path='/auth' element={<Auth />} />
                </Routes>
            </BrowserRouter>
        </CookiesProvider>
    )
}

export default Router;