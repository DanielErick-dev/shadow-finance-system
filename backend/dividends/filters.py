import django_filters
from .models import CardDividendMonth


class CardDividendMonthFilter(django_filters.FilterSet):
    ano = django_filters.NumberFilter(field_name='year', lookup_expr='exact')
    mes = django_filters.NumberFilter(field_name='month', lookup_expr='exact')

    class Meta:
        model = CardDividendMonth
        fields = ['year', 'month']
