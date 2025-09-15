import datetime
from decimal import Decimal
from dateutil.relativedelta import relativedelta
from django.db import transaction

from costumers.models import CustomUser
from expenses.models import InstallmentExpense, Expense, Category


class InstallmentExpenseService:
    def __init__(
        self,
        user: CustomUser,
        name: str,
        total_amount: Decimal,
        installments_quantity: int,
        first_due_date: datetime.date,
        category: Category | None
    ):
        self.user = user
        self.name = name
        self.total_amount = total_amount
        self.installments_quantity = installments_quantity
        self.first_due_date = first_due_date
        self.category = category

    @transaction.atomic
    def create(self) -> InstallmentExpense:
        installment_contract = InstallmentExpense.objects.create(
            user=self.user,
            name=self.name,
            total_amount=self.total_amount,
            installments_quantity=self.installments_quantity,
            first_due_date=self.first_due_date,
            category=self.category
        )
        self._create_individual_installments(installment_contract)
        return installment_contract

    def _create_individual_installments(self, contract: InstallmentExpense):
        installment_amount = round(self.total_amount / self.installments_quantity, 2)
        expenses_to_create = []
        for i in range(self.installments_quantity):
            due_date = self.first_due_date + relativedelta(months=i)
            expense_name = f'{self.name} ({i + 1}/{self.installments_quantity})'
            expense = Expense(
                user=self.user,
                name=expense_name,
                amount=installment_amount,
                due_date=due_date,
                category=self.category,
                installment_origin=contract
            )
            expenses_to_create.append(expense)
        Expense.objects.bulk_create(expenses_to_create)
