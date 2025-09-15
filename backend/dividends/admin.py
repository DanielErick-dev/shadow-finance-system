from django.contrib import admin
from .models import CardDividendMonth, ItemDividend


class CardDividendMonthAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'month', 'year', 'created_at', 'updated_at')
    search_fields = ('user__username', 'month', 'year')
    list_filter = ('user',)
    ordering = ('-year', '-month')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.filter(user=request.user)
        return queryset

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        kwargs["queryset"] = CardDividendMonth.objects.filter(user=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class ItemDividendAdmin(admin.ModelAdmin):
    list_display = ('id', 'card_month', 'asset', 'value', 'created_at', 'received_date')
    search_fields = ('card_month__user__username', 'asset__code', 'value')
    list_filter = ('card_month__user',)
    ordering = ('-created_at',)


admin.site.register(CardDividendMonth, CardDividendMonthAdmin)
admin.site.register(ItemDividend, ItemDividendAdmin)
