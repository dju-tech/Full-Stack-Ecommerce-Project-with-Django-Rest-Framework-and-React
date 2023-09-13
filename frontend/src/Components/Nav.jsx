import React, {useState, useEffect} from "react";
import Navbar from 'react-bootstrap/Navbar'
import logo from '../../assets/images/home/logo.png'
import '../Styles/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, NavLink} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Message from './Message'
import { cartActions } from '../Store/cartSlice'
import axios from "axios";



const navLinks = [
        {
            id: 1,
            url: 'HOME',
            to: '/'
        },
        {
            id: 2,
            url: 'SHOP',
            to: '/shop'
        }
]

const Nav = () => {

    const message = useSelector(state => state.message.notification)
    
    const cartQuantity = useSelector(state => state.cart.cartQuantity)

    const [showForm, setShowForm] = useState(false)

    const handleClose = () => {
        setShowForm(false)
    }

    const handleOpen = () => {
        setShowForm(true)
    }

    return (
        <>
        {
            showForm ?
            <div className="searchForm">
            <i className="bx bx-x closeForm" onClick={handleClose}></i>
            <form className="col-8">
                <input type="search" className="form-control" placeholder="Search products..." />
                <input type="submit" className="btn" />
            </form>
        </div> : <span></span>
        }
        <Navbar className='navBar shadow'>
                <div className="nav-container">
                    <Navbar.Brand href="/">
                        <img src={logo} alt="navbar brand" className="navbar-brand"/>
                    </Navbar.Brand>
                    <div className="middle-nav">
                        <ul>
                            {
                                navLinks.map((navLink) => <li key={navLink.id}>
                                    <NavLink to={navLink.to} className={({isActive}) => isActive ? 'nav-link navbar-link-active': 'nav-link'}>
                                        <span>
                                    {navLink.url}
                                    </span>
                                    </NavLink>
                                    </li>)
                            }
                        </ul>
                    </div>
                    <div className="nav-right">
                        <ul>
                            <li>
                                <span className="nav-right-icons" onClick={handleOpen}><i className='bx bx-search'></i></span>
                            </li>
                            <li>
                                <span className="nav-right-icons position-relative">
                                <Link to='/cart'>
                                <i className={`bx bx-shopping-bag`}>
                                    <span className="position-absolute  nav-badge-container top-0 start-100 translate-middle badge rounded-pill nav-badge-container">
                                        {cartQuantity}
                                    <span className="visually-hidden">shopping bag</span>
                                    </span>
                                </i>
                                </Link>
                                </span>
                            </li>
                            <li>
                                <Link to='/auth'>
                                    <span className="nav-right-icons"><i className={`bx bx-user`}></i></span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
        </Navbar>
        <div className="messageDiv">
                { message && <Message type={message.type} message={message.message} />}
        </div>
        </>
    )
}

export default Nav;