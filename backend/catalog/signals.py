from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Product
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

@receiver(pre_save, sender=Product)
def create_thumbnail(sender, instance, **kwargs):
	image = Image.open(instance.image)
	image = image.convert('RGB')
	image.thumbnail((300, 300), Image.ANTIALIAS)

	temp_thumb = BytesIO()
	image.save(temp_thumb, "JPEG")
	temp_thumb.seek(0)

	instance.thumbnail.save(f'{instance.name} image', ContentFile(temp_thumb.read()), save=False)
	temp_thumb.close()
    

