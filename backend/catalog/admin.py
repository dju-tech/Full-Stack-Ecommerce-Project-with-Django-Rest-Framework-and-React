from django.contrib import admin
from .models import (
	Product,
	Category,
	Cart,
	CartItem,
	Order,
	OrderItem
)

class CartitemAdmin(admin.ModelAdmin):
    list_display = (
        'id',
		'cart_id',
  		'quantity'
	)


admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Cart)
admin.site.register(CartItem, CartitemAdmin)
admin.site.register(Order)
admin.site.register(OrderItem)