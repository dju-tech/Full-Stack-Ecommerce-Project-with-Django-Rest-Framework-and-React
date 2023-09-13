# Generated by Django 4.0.5 on 2023-08-20 13:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.ImageField(null=True, upload_to='product_img'),
        ),
        migrations.AddField(
            model_name='product',
            name='thumbnail',
            field=models.ImageField(null=True, upload_to='thumbnail_img'),
        ),
        migrations.DeleteModel(
            name='ProductImage',
        ),
    ]
