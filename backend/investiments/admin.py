from django.contrib import admin
from .models import ItemInvestiment, CardInvestiment


@admin.register(CardInvestiment)
class CardInvestimentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'month', 'year', 'created_at', 'updated_at')
    search_fields = ('user__username', 'month', 'year')
    list_filter = ('year', 'month', 'user',)
    ordering = ('-year', '-month')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.filter(user=request.user)
        return queryset


@admin.register(ItemInvestiment)
class ItemInvestimentAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'get_card_info', 'asset', 'order_type', 'quantity', 'unit_price',
        'operation_date',
    )
    search_fields = ('card__user__username', 'asset__code',)
    list_filter = ('order_type', 'asset', 'card__year',)
    ordering = ('-operation_date',)
    autocomplete_fields = ['asset']

    @admin.display(description='Card (Mês/ano)', ordering='card__year')
    def get_card_info(self, obj):
        if obj.card:
            return f'{obj.card.month}/{obj.card.year}'
        return "N/A"

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset
        return queryset.filter(card__user=request.user)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'card':
            if not request.user.is_superuser:
                kwargs['queryset'] = CardInvestiment.objects.filter(user=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
