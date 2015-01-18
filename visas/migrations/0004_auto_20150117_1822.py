# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('visas', '0003_auto_20150117_1814'),
    ]

    operations = [
        migrations.AlterField(
            model_name='form',
            name='answer_set',
            field=models.ManyToManyField(to='visas.Answer', null=True, blank=True),
            preserve_default=True,
        ),
    ]
