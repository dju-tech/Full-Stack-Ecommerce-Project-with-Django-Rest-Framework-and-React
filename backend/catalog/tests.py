from rest_framework.test import APIClient, APITestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from .views import ProductViewDetails
from .models import Product
from PIL import Image
from io import BytesIO

class TestProductViewDetails(APITestCase):
	def setUp(self):
		self.client = APIClient()
		self.product = Product.objects.create(name = 'test product',brand = 'test brand',price = 12.99,image = self.get_image_file())
		self.url = reverse('product_detail', kwargs={'pk' : self.product.pk})
	def get_image_file(self, name='test.png', ext='png', size=(50, 50)):
		data = BytesIO()
		Image.new('RGBA', size, (255, 0, 0)).save(data, format=ext)
		return SimpleUploadedFile(name, data.getvalue())
	def test_retrieve(self):
		response = self.client.get(self.url)
		print(response.data)
		self.assertEqual(response.status_code, 200)

