# Generated by Django 5.1.4 on 2025-01-13 18:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Posts', '0002_hashtag_commentreport_like_posthashtag_postreport_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='media',
            field=models.FileField(upload_to='posts/'),
        ),
    ]
