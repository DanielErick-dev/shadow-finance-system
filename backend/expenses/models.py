from django.db import models
from costumers.models import CustomUser
from django.core.validators import MaxValueValidator, MinValueValidator


class Category(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='expense_categories',
        verbose_name='Usuário'
    )
    name = models.CharField(max_length=100, verbose_name='Nome')

    class Meta:
        verbose_name = 'Categoria De Despesa'
        verbose_name_plural = 'Categorias De Despesas'
        ordering = ['name']
        unique_together = ('user', 'name')

    def __str__(self):
        return self.name


class InstallmentExpense(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='installment_expenses',
        verbose_name='Usuário'
    )
    name = models.CharField(max_length=255, verbose_name='Nome da Compra')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Valor Total')
    installments_quantity = models.PositiveIntegerField(verbose_name='Quantidade de Parcelas')
    first_due_date = models.DateField(verbose_name='Data Da Primeira Parcela')
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        verbose_name='categoria',
        related_name='installment_expenses',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Despesa Parcelada'
        verbose_name_plural = 'Despesas Parceladas'
        ordering = ['-first_due_date']

    def __str__(self):
        return f'{self.name} ({self.installments_quantity}x)'


class Expense(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='expenses',
        verbose_name='Usuário'
    )
    name = models.CharField(max_length=255, verbose_name='Nome da Despesa')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Valor')
    due_date = models.DateField(verbose_name='Data de Vencimento')
    payment_date = models.DateField(
        verbose_name='Data de Pagamento',
        null=True,
        blank=True
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        verbose_name='categoria',
        related_name='expenses',
        null=True,
        blank=True
    )
    paid = models.BooleanField(default=False, verbose_name='Pago')
    installment_origin = models.ForeignKey(
        InstallmentExpense,
        on_delete=models.CASCADE,
        verbose_name='parcelado',
        related_name='installments',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Despesa'
        verbose_name_plural = 'despesas'
        ordering = ['due_date']

    def __str__(self):
        return self.name


class RecurringExpense(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='recurring_expenses',
        verbose_name='Usuário'
    )
    name = models.CharField(max_length=255, verbose_name='Nome Da Despesa')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Valor da Despesa')
    due_day = models.PositiveIntegerField(
        verbose_name='Dia Do Vencimento',
        validators=[MinValueValidator(1), MaxValueValidator(31)]
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name='recurring_expenses',
        verbose_name='Categoria',
        null=True,
        blank=True
    )
    start_date = models.DateField(verbose_name='Data De Inicio')
    end_date = models.DateField(verbose_name='Data de Término', null=True, blank=True)
    active = models.BooleanField(default=True, verbose_name='Ativo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Despesa Recorrente'
        verbose_name_plural = 'Despesas Recorrentes'
        ordering = ['name']

    def __str__(self):
        return f'{self.name} (R$ {self.amount}) todo dia {self.due_day}'


class PaidRecurringExpense(models.Model):
    recurring_expense = models.ForeignKey(
        RecurringExpense,
        on_delete=models.CASCADE,
        related_name='paid_instances',
        verbose_name='despesa recorrente'
    )
    payment_date = models.DateField(verbose_name='Data do Pagamento')
    month = models.PositiveIntegerField(verbose_name='Mês de Referência')
    year = models.PositiveIntegerField(verbose_name='Ano de Referência')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Pagamento de Despesa Recorrente'
        verbose_name_plural = 'Pagamentos de Despesas Recorrentes'
        unique_together = ('recurring_expense', 'month', 'year')

    def __str__(self):
        return f'Pagamento de {self.recurring_expense.name} para {self.month}/{self.year}'
