from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description =  models.TextField(blank=True)
    meta_keywords = models.CharField('Meta Keywords', max_length = 255, help_text = 'Comma-delimited set of SEO keywords for meta tag')
    meta_description = models.CharField('Meta Description', max_length = 255, help_text = 'Content for description meta tag')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Categories'
        verbose_name_plural = 'Categories'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
class Product(models.Model):
    name = models.CharField(max_length=100, unique=True)
    brand = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=9, decimal_places=2)
    description = models.TextField()
    meta_keywords = models.CharField('Meta Keywords', max_length = 255, help_text = 'Comma-delimited set of SEO keywords for meta tag')
    meta_description = models.CharField('Meta Description', max_length = 255, help_text = 'Content for description meta tag')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ManyToManyField(Category)
    is_featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=True)
    image = models.ImageField(upload_to='product_img', null=True)     
    thumbnail = models.ImageField(upload_to='thumbnail_img', null=True, blank=True)
    
    class Meta:
        db_table =  'Products'
        ordering = ['created_at']
    
    def __str__(self):
        return self.name
    
    def get_category(self):
        name = []
        for x in self.category.all():
            name.append({
                'category_id' : x.id,
                'category_name' : x.name,
                'category_description' : x.description
            })
        return name
    
    @property
    def image_url(self):
        if self.thumbnail and hasattr(self.thumbnail, 'url'):
            return self.thumbnail.url
        

class Cart(models.Model):
    cart_id = models.CharField(max_length=50, null=True, blank=True, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)

    @property
    def total_quantity(self):
        return self.cartitems.all().count()
    
    @property
    def total_price(self):
        value =  sum(float(i.total_price) for i in self.cartitems.all())
        value = "{:.2f}".format(value)
        return value
    
class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name = 'cartitems')
    
    @property
    def total_price(self):
        product = self.product.price
        print(product)
        quantity = Decimal(self.quantity)
        value = "{:.2f}".format(float(product * quantity))
        print(value)
        return value

class Order(models.Model):
    SUBMITTED = 1
    PROCESSED = 2
    SHIPPED = 3
    CANCELLED = 4
    
    ORDER_STATUSES = ((SUBMITTED, 'Submitted'),
                        (PROCESSED, 'Processed'),
                        (SHIPPED, 'Shipped'),
                        (CANCELLED, 'Cancelled'),
                      )

        #order info
    date = models.DateTimeField(auto_now_add = True)
    status = models.IntegerField(choices = ORDER_STATUSES, default = SUBMITTED)
    last_updated = models.DateTimeField(auto_now = True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    transaction_id = models.CharField(max_length = 20)
    
    #contact info
    email = models.EmailField(max_length = 50)
    phone = models.CharField(max_length = 20)
    
    payment_type = models.CharField(max_length = 255)
    
    # billing information
    billing_name = models.CharField(max_length = 50)
    billing_address = models.CharField(max_length = 1000)
    billing_city = models.CharField(max_length = 50)
    billing_state = models.CharField(max_length = 20)
    billing_country = models.CharField(max_length = 50)
    billing_zip = models.CharField(max_length = 10)
    
    def __str__(self):
        return "Order #" + str(self.id)
    
    
    def total_amount(self):
        total = sum(i.price for i in self.orderitems.all())
        total = "{:.2f}".format(total)
        return total
    
class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete = models.CASCADE)
    quantity = models.IntegerField(default = 1)
    price = models.DecimalField(max_digits = 9, decimal_places = 2)
    order = models.ForeignKey(Order, on_delete = models.CASCADE, related_name='orderitems')
    
    