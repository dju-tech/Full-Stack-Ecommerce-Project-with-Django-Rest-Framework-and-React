from django.urls import path
from .views import ( 
	ProductViewList, 
	ProductViewDetails,
 	CartView,
	ShopView,
	Checkout,
	CheckoutValidateView,
	UserView,
	Login
	)

from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register('auth/register', UserView, basename='register')

urlpatterns = [

 	path('auth/login/', Login.as_view()),
	path('products/', ProductViewList.as_view()),
	path('product_detail/<int:pk>/', ProductViewDetails.as_view(), name='product_detail'),
	path('cart/', CartView.as_view(), name='cart'),
	path('shop/', ShopView.as_view(), name='shop'),
	path('checkout/', Checkout.as_view(), name='checkout'),
	path('checkout/success/<str:status>/<str:tx_ref>/<int:transaction_id>/', CheckoutValidateView.as_view(), name='checkout_success'),
]