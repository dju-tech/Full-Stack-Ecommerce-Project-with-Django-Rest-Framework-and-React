import 'bootstrap/dist/css/bootstrap.min.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../Styles/style.css'
import React from 'react'


const Footer = () => {
	return (

		<Row className="padding-general footer-container footer">
			<Col className='col-12 col-lg-3 mb-4'>
				<div>
					<h6>
						Contact
					</h6>
					<div>
						<p className='text-white'>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nobis quam nihil unde quod laboriosam eveniet amet atque iure incidunt, nisi voluptatibus saepe.
						</p>
					</div>
				</div>
			</Col>
			<Col className='col-12 col-lg-3 mb-4'>
				<div>
					<h6>
						My Account
					</h6>
					<ul>
						<li>
							<a href="">
							<i className='chev-right bx bx-chevron-right text-white'></i>
								Sign In
							</a>
						</li>
						<li>
							<a href="">
							<i className='chev-right bx bx-chevron-right text-white'></i>
								View Cart
							</a>
						</li>
						<li>
							<a href="">
							<i className='chev-right bx bx-chevron-right text-white'></i>
								Help
							</a>
						</li>
					</ul>
				</div>
			</Col>
			<Col className='col-12 col-lg-3 mb-4'>
				<div>
					<h6>
						Useful Links
					</h6>
					<ul>
						<li>
							<a href="">
							<i  className='chev-right bx bx-chevron-right text-white'></i>
								About Us
							</a>
						</li>
						<li>
							<a href="">
							<i className='chev-right bx bx-chevron-right text-white'></i>
								Contact Us
							</a>
						</li>
						<li>
							<a href="">
							<i className='chev-right bx bx-chevron-right text-white'></i>
								Login
							</a>
						</li>
					</ul>
				</div>
			</Col>
			<Col className='col-12 col-lg-3 mb-4'>
				<div>
					<h6>
						Customer Service
					</h6>
					<ul>
						<li>
							<a href="">
							<i className='chev-right bx bx-chevron-right text-white'></i>
								Terms and Conditions
							</a>
						</li>
						<li>
							<a href="">
							<i className='chev-right bx bx-chevron-right text-white'></i>
								Privacy Policy
							</a>
						</li>
					</ul>
				</div>
			</Col>
		</Row>

	)
}

export default Footer;