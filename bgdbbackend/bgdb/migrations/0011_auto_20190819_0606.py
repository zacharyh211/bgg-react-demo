# Generated by Django 2.2.4 on 2019-08-19 06:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bgdb', '0010_auto_20190819_0433'),
    ]

    operations = [
        migrations.AddField(
            model_name='boardgame',
            name='average_weight',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='boardgame',
            name='median',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='boardgame',
            name='num_comments',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='boardgame',
            name='num_weights',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='boardgame',
            name='owned',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='boardgame',
            name='standard_deviation',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='boardgame',
            name='trading',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='boardgame',
            name='wanting',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='boardgame',
            name='wishing',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]