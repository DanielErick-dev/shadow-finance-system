from django.db import models
from costumers.models import CustomUser
from assets.models import Asset


class CardDividendMonth(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    month = models.IntegerField()
    year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Card de Dividendo do Mês"
        verbose_name_plural = 'Cards de Dividendos do mês'
        unique_together = ('user', 'month', 'year')
        ordering = ['-year', '-month']


class ItemDividend(models.Model):
    card_month = models.ForeignKey(
        CardDividendMonth,
        on_delete=models.CASCADE,
        related_name='itens',
        verbose_name='Card Do Mês'
    )
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, verbose_name='Ativo')
    value = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Valor')
    received_date = models.DateField(verbose_name='Data de Recebimento')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Item de Dividendo Do Mês'
        ordering = ['-created_at']
