from .models import Expense
import django_filters


class ExpenseFilter(django_filters.FilterSet):
    due_date__year = django_filters.NumberFilter(field_name='due_date', lookup_expr='year')
    due_date__month = django_filters.NumberFilter(field_name='due_date', lookup_expr='month')

    class Meta:
        model = Expense
        fields = ['paid', 'category']
