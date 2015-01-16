# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('question_text_eng', models.CharField(max_length=400)),
                ('question_text_esp', models.CharField(max_length=400)),
                ('answer', models.CharField(max_length=1000000)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
