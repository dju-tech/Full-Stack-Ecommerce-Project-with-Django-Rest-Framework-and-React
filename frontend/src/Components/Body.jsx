import Button from 'react-bootstrap/Button'
import '../Styles/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import delivery from '../../assets/images/home/delivery.svg'
import payment from '../../assets/images/home/payment.svg'
import returnPic from '../../assets/images/home/return.svg'
import support from '../../assets/images/home/support.svg'
import ProductCard from './productCard.jsx'
import Form from 'react-bootstrap/Form'
import exploreBtn from '../../assets/images/home/explore-link.png'
import {Link} from 'react-router-dom'
import React, {useEffect, useState} from 'react'
import axios from 'axios'

axios.defaults.withCredentials = true;

const Body = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
                axios.get('http://localhost:8000/api/v1/products/', {
                    headers : {
                        'Content-Type': 'application/json', 
                        }          
                })
                .then(response => { 
                    setProducts(response.data)
                })
                .catch(e => { console.log(e)})
        }, 1000)
        setLoading(false)
    }, [])

    return (
        <>
        <div></div>
        <div className="hero">
            <div className="hero-text">
                <span>
                    SHOP THE WORLD
                </span>
                <h1>
                    Find your style with us
                </h1>
                <Link to='/shop'>
                <button className="shop-now-btn">SHOP NOW</button>
                </Link>
            </div>
        </div> 
        <div className="site-promise bg-light padding-general">
            <Row>
                <Col className="site-column">
                    <Card className="site-promise-card">
                        <img src={delivery} alt="picture for payment and delivery" className="site-promise-img"/>
                        <span>
                            Payment & Delivery
                        </span>
                    </Card>
                </Col>
                <Col className="site-column">
                    <Card className="site-promise-card">
                        <img src={returnPic} alt="picture for return and refund" className="site-promise-img"/>
                        <span>
                            Return & Refund
                        </span>
                    </Card>
                </Col>
                <Col className="site-column">
                    <Card className="site-promise-card">
                        <img src={payment} alt="picture for secure payment" className="site-promise-img"/>
                        <span>
                            Secure Payment
                        </span>
                    </Card>
                </Col>
                <Col className="site-column">
                    <Card className="site-promise-card">
                        <img src={support} alt="picture for quality support" className="site-promise-img" />
                        <span>
                            Quality Support
                        </span>
                    </Card>
                </Col>
            </Row>
        </div>
        <div className="featured padding-general  mt-5">
            <div>
                <h3 className="text-center">
                    FEATURED PRODUCTS
                </h3>
                <p className="text-muted text-center mb-5">
                    Shop from our latest collections and enjoy the best we have to offer
                </p>
            </div>
            <div className="products-container padding-general">
                <Row className="product-row">
                    {
                        loading ?

                        <h3 className='text-center'>Loading...</h3>
                        :
                     products.map(product => {
                        return (
                            <ProductCard key={product.id} product_id={product.id} productimagesrc={`http://localhost:8000${product.image_url}`} productprice={product.price} producttitle={product.name} />
                        )
                     }) 
                    }
                </Row>
            </div>
        </div>
        <div className="discount-section">
            <div className="text-center">
                <h2 className="text-white">
                    Enjoy discount on all your purchases
                </h2>
                <h2 className='text-white'>Lets go!!! </h2>
            </div>
            <div>
            <Link to='/shop'>
            <span className='explore-link'><img src={exploreBtn} alt="explore button"  /></span>
            </Link>
            </div>
        </div>

        <div className='subscribe-section'>
            <div className='row h-100'>
                <div className='d-flex justify-content-center align-items-center h-100 col bg-light'>
                    <div>
                        <h4 className='text-center mb-3'>SUBSCRIBE TO OUR NEWSLETTER</h4>
                        <span className='d-block text-center mb-3'>Get the latest updates on our newest products</span>
                        <Form className="d-flex justify-content-center align-items-center flex-column">
                            <Form.Control type="email" placeholder="Enter email" className="mb-3" />
                            <Button type='submit' className='btn subscribe-btn'>SUBSCRIBE</Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Body