from django.db import models
from costumers.models import CustomUser
from assets.models import Asset


class OrderType(models.TextChoices):
    BUY = ('BUY', 'Buy')
    SELL = ('SELL', 'Sell')


class CardInvestiment(models.Model):
    month = models.IntegerField(verbose_name='Mês')
    year = models.IntegerField(verbose_name='Ano')
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='investiments',
        verbose_name='Usuário'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Card De Investimento Do Mês'
        unique_together = ('month', 'year', 'user')
        ordering = ['-year', '-month']

    def __str__(self):
        return f'{self.year}/{self.month}'


class ItemInvestiment(models.Model):
    asset = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE,
        verbose_name='Ativo'
    )
    card = models.ForeignKey(
        CardInvestiment,
        on_delete=models.CASCADE,
        related_name='itens',
        verbose_name='Card do Mês'
    )
    order_type = models.CharField(
        max_length=6,
        choices=OrderType.choices,
        default=OrderType.BUY,
        verbose_name='Tipo De Ordem'
    )
    quantity = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        verbose_name='Quantidade'
    )
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Preço Unitário'
    )
    operation_date = models.DateField(verbose_name='Data Da Operação')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Item De Investimento Do Mês'

    def __str__(self):
        return f'{self.order_type} de {self.asset.code} em {self.operation_date}'
