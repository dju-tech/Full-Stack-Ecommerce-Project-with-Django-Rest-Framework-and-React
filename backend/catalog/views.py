from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.mixins import(
    ListModelMixin,
    RetrieveModelMixin
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets

from .models import (
    Category,
    Cart, 
    CartItem,
    Product,
    Order,
    OrderItem
)

from .serializers import (
    ProductSerializer,
    CartSerializer,
    CartItemSerializer,
    CategorySerializer,
    OrderItemSerializer,
    OrderSerializer,
    UserSerializer
)

from django.shortcuts import get_object_or_404
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import random
import requests
from .flw import FlutterwaveApi

class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = ()
    authentication_classes = ()

class Login(APIView):
    permission_classes = ()
    def post(self, request):
        print(request.data)
        username = request.data['username']
        pwd = request.data['password']
        user = authenticate(username=username, password=pwd)
        if user:
            return Response({'token': user.auth_token.key}, status=status.HTTP_202_ACCEPTED)
        else:
            return Response({'error': 'Wrong Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class ProductViewList(generics.ListAPIView):
    #retrive, get
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)
    
class ShopView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

class ProductViewDetails(APIView):
    permission_classes = (AllowAny,)
    def get_object(self, pk):
        return get_object_or_404(Product, pk=pk)
    def get(self, request, pk):
        product = self.get_object(pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartView(APIView):
    permission_classes = (AllowAny, )

    #get, create(post), read, delete
    def get_cart(self, request):
        cart_id = request.query_params['cart_id']
        print(f'The cart id is {cart_id}')
        user = request.user if request.user.is_authenticated else None
        if not cart_id:
            request.session.create()
            cart_id = request.session.session_key
            
        try:
            cart = Cart.objects.get(cart_id=cart_id)
        except Cart.DoesNotExist:
            cart = Cart.objects.create(cart_id=cart_id, user=user)
        else:
            cart.user = user
            cart.save()
            
        return cart
    def get(self, request):
        cart = self.get_cart(request)
        cartitems = cart.cartitems.all()
        data = []
        for item in cartitems:
            product = {
                'id' : item.product.id,
                'name' : item.product.name,
                'price' : item.product.price,
                'brand' : item.product.brand,
                'description' : item.product.description,
                'image_url' : item.product.image_url,
                'categories' : CategorySerializer(item.product.category, many=True).data
            }
            item_data = {
                'id'  : item.id,
                'product' : product,
                'cart_details' : {
                    'id' : item.cart.id,
                    'cart_id' : item.cart.cart_id,
                    'user' : item.cart.user.id if item.cart.user else None,
                },
                'quantity' : item.quantity,
                'total_price' : item.total_price
            }
            data.append(item_data)
        # print(data)
        return Response({
                            'data' : data,
                            'cart_total' : cart.total_price,
                            'cart_quantity' : cart.total_quantity,
                            'cart_id' : cart.cart_id
                         }, status=status.HTTP_200_OK)
    def patch(self, request):
        cart = self.get_cart(request)
        # print(request.data['quantity'])
        cartitem = CartItem.objects.filter(product__id=request.data['product'], cart=cart).first()
        serializer = CartItemSerializer(cartitem, data=request.data, partial=True)
        data = []
        if serializer.is_valid():
            serializer.save(cart=cart)
            product_data = Product.objects.get(id=int(serializer.data['product']))
            product = {
                'id' : product_data.id,
                'name' : product_data.name,
                'price' : product_data.price,
                'brand' : product_data.brand,
                'description' : product_data.description,
                'image_url' : product_data.image_url,
                'categories' : CategorySerializer(product_data.category, many=True).data
            }
            cartitem = CartItem.objects.filter(id=int(serializer.data['id']), product__id=int(serializer.data['product']), cart__id=int(serializer.data['cart'])).first()
            item_data = {
                'id'  : cartitem.id,
                'product' : product,
                'cart_details' : {
                    'id' : serializer.data['cart'],
                    'cart_id' : cartitem.cart.cart_id,
                    'user' : cartitem.cart.user.id if cartitem.cart.user else None
                },
                'quantity' : cartitem.quantity,
                'total_price' : cartitem.total_price
            }
            return Response(item_data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def post(self, request):
        cart = self.get_cart(request)
        product = get_object_or_404(Product, id=int(request.data['product_id']))
        data = {
            'product' : int(request.data['product_id']),
            'cart' : cart.id,
            'quantity' : int(request.data.get('quantity', 1))
        }
        serializer = CartItemSerializer(data=data)
        if serializer.is_valid():
            cartitem = serializer.save()
            product_data = {
                'id' : product.id,
                'name' : product.name,
                'price' : product.price,
                'brand' : product.brand,
                'description' : product.description,
                'image_url' : product.image_url,
                'categories' : CategorySerializer(product.category, many=True).data
            }
            item_data = {
                'id'  : cartitem.id,
                'product' : product_data,
                'cart_details' : {
                    'id' : cart.id,
                    'cart_id' : cartitem.cart.cart_id,
                    'user' : cartitem.cart.user.id if cartitem.cart.user else None
                },
                'quantity' : cartitem.quantity,
                'total_price' : cartitem.total_price
            }
            return Response({
                    'item_data' : item_data,
                    'cart_id' : cart.cart_id
                }, status=status.HTTP_201_CREATED)
        else:
            # print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        cart = self.get_cart(request)
        print(cart)
        print(request.data['product'])
        cartitem = CartItem.objects.filter(product__id=request.data['product'], cart=cart).first()
        print(cartitem)
        id=cartitem.id
        cartitem.delete()
        product_data = Product.objects.get(id=int(request.data['product']))
        product = {
            'id' : product_data.id,
            'name' : product_data.name,
            'price' : product_data.price,
            'brand' : product_data.brand,
            'description' : product_data.description,
            'image_url' : product_data.image_url,
            'categories' : CategorySerializer(product_data.category, many=True).data
        }
        item_data = {
            'id'  : id,
            'product' : product,
            'cart_details' : {
                'id' : cart.id,
                'cart_id' : cartitem.cart.cart_id,
                'user' : cartitem.cart.user.id if cartitem.cart.user else None
            },
            'quantity' : cartitem.quantity,
            'total_price' : cartitem.total_price
        }
        return Response(item_data)

    
class Checkout(APIView):
    permission_classes = (IsAuthenticated,)
    def get_cart(self, request):
        cart_id = request.query_params['cart_id']
        cart = Cart.objects.filter(cart_id=cart_id).first()
        cart.user = request.user
        cart.save()
        return cart
    def get(self, request):
        cart = self.get_cart(request)
        cartitems = CartItem.objects.filter(cart=cart)
        data = []
        for item in cartitems:
            product = {
                'id' : item.product.id,
                'image_url' : item.product.image_url,
                'name' : item.product.name
            }
            item_data = {
                'id' : item.id,
                'product' : product,
                'quantity' : item.quantity,
                'total_price' : item.total_price
            }
            data.append(item_data)
        return Response({
                            'data' : data,
                            'order_total' : cart.total_price
                         }, status=status.HTTP_200_OK)
    def post(self, request):
        cart = self.get_cart(request)
        user = request.user.id
        transaction_id = 'Order' + str(random.randint(1, 1000000000))
        email = request.data['email']
        phone = request.data['phone_number']
        payment_type = request.data.get('payment_type')
        billing_name = request.data['first_name'] + ' ' + request.data['last_name']
        billing_address = request.data.get('delivery')
        billing_city = request.data['city']
        billing_state = request.data['state']
        billing_country = request.data['country']
        billing_zip = request.data['postal_code']
        
        data = {
            'user' : user,
            'transaction_id' : transaction_id,
            'email' : email,
            'phone' : phone,
            'payment_type' : payment_type,
            'billing_name' : billing_name,
            'billing_address' : billing_address,
            'billing_city' : billing_city,
            'billing_state' : billing_state,
            'billing_country' : billing_country,
            'billing_zip' : billing_zip
        }
        serializer = OrderSerializer(data=data)
        print(serializer.is_valid())
        if serializer.is_valid():

            payment_data = {
                'tx_ref' : transaction_id,
                'amount' : float(cart.total_price),
                'currency' : 'NGN',
                'redirect_url' : 'http://localhost:3000/checkout/success',
                'meta' : {
                    'consumer_id' : 2
                },
                'customer' : {
                    'email' : 'test@gmail.com',
                    'phonenumber' : phone,
                    'name' : billing_name
                },
                'customizations' : {
                    'title' : 'Ecomstore Payments'
                }
            }
            print(payment_data)
            headers = {
                'Authorization' : f'Bearer {settings.FLUTTERWAVE_PRIVATE_KEY}',
                'Content-Type' : 'application/json'
            }
            print(headers)
            url = f'https://api.flutterwave.com/v3/payments'
            response = requests.post(url, json=payment_data, headers=headers)
            print(response)
            try:
                response_data = response.json()
            except Exception as e:
                print(e)
                return Response({'error' : 'payment unsuccessful'}, status=status.HTTP_400_BAD_REQUEST)            
            else:
                print(response_data)
                if response_data['status'] == 'success':
                    order = serializer.save()
                    for item in cart.cartitems.all():
                        OrderItem.objects.create(
                            product = item.product,
                            quantity = item.quantity,
                            price = item.total_price,
                            order = order
                        )
                    link = response_data['data']['link']
                message = {
                    'redirect_link' : link,
                    'message' : 'payment successful',
                    'data' : serializer.data
                }
            return Response(message, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
class CheckoutValidateView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, status, tx_ref, transaction_id):
        transaction_details = Order.objects.get(transaction_id=tx_ref)
        order_total = 0
        for item in transaction_details.orderitems.all():
            order_total += item.price
        print(type(order_total))
        flw = FlutterwaveApi(settings.FLUTTERWAVE_PRIVATE_KEY)
        response = flw.verify_transaction(transaction_id)
        print(type(response['data']['amount']))
        if response['data']['status'] == 'successful' and response['data']['amount'] == float(order_total) and response['data']['currency'] == 'NGN':
            cart = Cart.objects.filter(user=request.user).first()
            cart.delete()
            transaction_details.status = 2
            transaction_details.save()
            data = []
            for item in transaction_details.orderitems.all():
                data.append({
                    'id' : item.id,
                    'name' : item.product.name,
                    'price' : item.price,
                    'quantity' : item.quantity,
                    'image_url' : item.product.image_url
                })
            print(data)
            return Response(data)
        else:
            return Response({'error' : 'Payment Failed'})
        