import django_filters
from .models import CardInvestiment


class CardInvestimentMonthFilter(django_filters.FilterSet):
    year = django_filters.NumberFilter(field_name='year', lookup_expr='exact')
    month = django_filters.NumberFilter(field_name='month', lookup_expr='exact')

    class Meta:
        model = CardInvestiment
        fields = ['year', 'month']
