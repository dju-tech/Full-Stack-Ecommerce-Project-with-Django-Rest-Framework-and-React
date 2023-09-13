import axios from 'axios'

axios.defaults.withCredentials = true;

export default class ApiService {


	static addToCart = async (token, product_id, quantity, cart_id) => {
		console.log('The cart id is ' + cart_id)
		const config = {
			headers : {
				'Content-Type' : 'application/json',
			}
		}
		
		if (token && token['authToken'] !== undefined){
			config.headers.Authorization = `Token ${token['authToken']}`
		}

		// console.log(token ? token['authToken'] : 'token not defined')
		try{
			console.log(product_id)
			console.log(quantity)
			const response = await axios.post(`http://localhost:8000/api/v1/cart/?cart_id=${cart_id}`, {
				'product_id' : product_id,
				'quantity' : quantity
			}, config)
			return response
		}catch(e){
			throw(e)
		}
	}

	static updateCart = async (token, product_id, quantity, cart_id) => {
		const config = {
			headers : {
				'Content-Type' : 'application/json',
			}
		}
		
		if (token && token['authToken'] !== undefined){
			config.headers.Authorization = `Token ${token['authToken']}`
		}
		try{
			const response = await axios.patch(`http://localhost:8000/api/v1/cart/?cart_id=${cart_id}`, {
				'product' : product_id,
				'quantity' : quantity
			}, config)
			return response
		}catch(e){
			throw(e)
		}
	}

	static deleteItem = async (token, productId, cart_id) => {
		const config = {
			headers : {
				'Content-Type' : 'application/json',
			}
		}
		
		if (token && token['authToken'] !== undefined){
			config.headers.Authorization = `Token ${token['authToken']}`
		}
		try{
			const response = await axios.delete(`http://localhost:8000/api/v1/cart/?cart_id=${cart_id}`, {
				data : {
					'product' : productId
				}
			}, config)
			return response
		}catch(e){
			throw(e)
		}
	}

	static handleLogin = async  ({username, password}) => {
        try {
            const response =await  axios.post('http://localhost:8000/api/v1/auth/login/', {
                username,
                password
            })
            return response
        }catch(error){
            throw(error)
        }
    }

	static handleRegister =   ({username, password}) => {
        try {
            const response =  axios.post('http://localhost:8000/api/v1/auth/register/', {
                username,
                password
            })
            return response
        }catch(error){
            throw(error)
        }
    }

}