from django.db import models
from costumers.models import CustomUser


class TypeAsset(models.TextChoices):
    ACAO = 'ACAO', 'Ação'
    FII = 'FII', 'Fundo Imobiliário'
    BDR = 'BDR', 'BDR'
    ETF = 'ETF', 'ETF'


class Asset(models.Model):
    code = models.CharField(max_length=10)
    type = models.CharField(max_length=4, choices=TypeAsset.choices, default=TypeAsset.ACAO)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    class Meta:
        db_table = 'assets_asset'
        unique_together = ('code', 'user')
        ordering = ['code']
        verbose_name = 'Ativo'

    def save(self, *args, **kwargs):
        self.code = self.code.upper().strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.code
