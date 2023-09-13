import Nav from '../Components/Nav'
import ProductCard from '../Components/productCard'
import Footer from '../Components/Footer'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import 'bootstrap/dist/css/bootstrap.min.css';


axios.defaults.withCredentials = true;

const Shop = () => {


    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/shop')
        .then(res => {
            setProducts(res.data)
            setLoading(true)
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        })
        .catch(e => console.log(e))
    }, [])


    return (
        <>
            <Nav />
            <div className="products-container padding-general navDistance">
                <Row className="product-row">
                    {
                        loading
                        ?
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
            <Footer />
        </>
    )
}
export default Shop;