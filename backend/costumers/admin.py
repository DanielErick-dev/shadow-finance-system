from django.contrib import admin
from costumers.models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', )
    list_filter = ('username',)
