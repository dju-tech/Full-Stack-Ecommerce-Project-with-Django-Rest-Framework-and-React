from rest_framework import serializers
from rest_framework.authtoken.models import Token

from django.contrib.auth.models import User
from .models import (
    Product,
    Category,
    Cart, 
    CartItem,
    Order,
    OrderItem
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {
            'password' : {
                'write_only' : True
            }
        }
        
    def create(self, validated_data):
        user = User(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        Token.objects.create(user=user)
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'description']

class ProductSerializer(serializers.ModelSerializer):
    categories = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id', 'name', 'image_url', 'price', 'brand', 'description', 'categories', 'is_new', 'is_featured']
    def get_image_url(self, instance):
        return instance.image_url  
    def get_categories(self, instance):
        return instance.get_category()

class CartSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Cart
        fields = ['id', 'cart_id', 'user']

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'cart', 'quantity']
    def create(self, validated_data):
        if CartItem.objects.filter(product=validated_data['product']).exists():
            cartitem = CartItem.objects.filter(product=validated_data['product']).first()
            cartitem.quantity = cartitem.quantity + int(validated_data['quantity'])
            cartitem.save()
            return cartitem
        else:
            cartitem = CartItem.objects.create(**validated_data)
            return cartitem
            
        
class OrderSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Order
        fields = ['id', 'user', 'transaction_id', 'email', 'phone', 'payment_type', 'billing_name', 'billing_address', 'billing_city', 'billing_state', 'billing_country', 'billing_zip']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'order']