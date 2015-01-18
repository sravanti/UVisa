# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('visas', '0004_auto_20150117_1822'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='form',
            name='answer_set',
        ),
        migrations.AddField(
            model_name='question',
            name='answer',
            field=models.ForeignKey(blank=True, to='visas.Answer', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='answer',
            name='answer_text',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='answer',
            name='audio',
            field=models.FileField(null=True, upload_to=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='answer',
            name='transcription',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
