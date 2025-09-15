import datetime
from expenses.models import Expense, RecurringExpense, PaidRecurringExpense
from expenses.serializer import ExpenseSerializer, CategorySerializer
from calendar import monthrange


class MonthlyExpenseLogic:
    def __init__(self, user, year: int, month: int):
        self.user = user
        self.year = year
        self.month = month

    def get_monthly_expenses(self) -> list:
        real_expenses = self._get_real_expenses()
        virtual_expenses = self._get_virtual_recurring_expenses()
        real_expenses_data = ExpenseSerializer(real_expenses, many=True).data

        for expense_data in real_expenses_data:
            expense_data['is_recurring'] = False
            if expense_data.get('installment_origin'):
                expense_data['expense_type'] = 'installment'
            else:
                expense_data['expense_type'] = 'simple'

        combined_list = real_expenses_data + virtual_expenses
        combined_list.sort(key=lambda x: x['due_date'])
        return combined_list

    def _get_real_expenses(self):
        return Expense.objects.filter(
            user=self.user,
            due_date__year=self.year,
            due_date__month=self.month
        )

    def _get_virtual_recurring_expenses(self) -> list:
        last_day = monthrange(self.year, self.month)[1]
        active_contracts = RecurringExpense.objects.filter(
            user=self.user,
            active=True,
            start_date__lte=datetime.date(self.year, self.month, last_day)
        )

        paid_recurring_ids = PaidRecurringExpense.objects.filter(
            recurring_expense__user=self.user,
            year=self.year,
            month=self.month
        ).values_list('recurring_expense_id', flat=True)

        virtual_expenses = []
        for contract in active_contracts:
            if contract.end_date and contract.end_date < datetime.date(self.year, self.month, 1):
                continue

            due_day = min(contract.due_day, last_day)
            due_date = datetime.date(self.year, self.month, due_day)
            virtual_expense = {
                'id': contract.id,
                'name': contract.name,
                'amount': contract.amount,
                'due_date': due_date.isoformat(),
                'category': CategorySerializer(contract.category).data if contract.category else None,
                'paid': contract.id in paid_recurring_ids,
                'is_recurring': True,
                'expense_type': 'recurring',
                'payment_date': None,
                'installment_origin': None,
                'created_at': contract.created_at.isoformat()
            }
            virtual_expenses.append(virtual_expense)
        return virtual_expenses
