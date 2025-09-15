from django.contrib import admin
from .models import Asset


class AssetAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'user', 'type')
    search_fields = ('code', 'type')
    list_filter = ('user',)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.filter(user=request.user)
        return queryset

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "asset":
            kwargs["queryset"] = Asset.objects.filter(user=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


admin.site.register(Asset, AssetAdmin)
