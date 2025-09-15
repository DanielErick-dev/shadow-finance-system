from django.contrib import admin
from .models import Category, Expense, InstallmentExpense, RecurringExpense, PaidRecurringExpense
from .services.installment_manager_service import InstallmentExpenseService


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', )
    search_fields = ('name', 'user__username', )
    ordering = ('name', )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.filter(user=request.user)
        return queryset


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'amount', 'due_date', 'category', 'paid', 'user', )
    search_fields = ('name', 'category__name', 'user__username', )
    list_filter = ('paid', 'due_date', 'category', 'user')
    ordering = ('-due_date', )
    list_editable = ('paid', )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.filter(user=request.user)
        return queryset

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field == 'category':
            kwargs["queryset"] = Category.objects.filter(user=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(InstallmentExpense)
class InstallmentExpenseAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'total_amount',
        'installments_quantity',
        'first_due_date',
        'category',
    )
    search_fields = ('name', 'user__username', 'category__name', )
    list_filter = ('first_due_date', 'user', 'category', )
    ordering = ('-first_due_date', )
    autocomplete_fields = ['category']

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset
        return queryset.filter(user=request.user)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'category':
            if not request.user.is_superuser:
                kwargs['queryset'] = Category.objects.filter(user=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if not change:
            service = InstallmentExpenseService(
                user=request.user,
                name=form.cleaned_data.get('name'),
                total_amount=form.cleaned_data.get('total_amount'),
                installments_quantity=form.cleaned_data.get('installments_quantity'),
                first_due_date=form.cleaned_data.get('first_due_date'),
                category=form.cleaned_data.get('category')
            )
            service.create()
        else:
            return super().save_model(request, obj, form, change)


@admin.register(RecurringExpense)
class RecurringExpenseAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'amount', 'due_day', 'start_date', 'end_date', )
    list_filter = ('active', 'user', 'category', )
    ordering = ('name', )


@admin.register(PaidRecurringExpense)
class PaidRecurringExpenseAdmin(admin.ModelAdmin):
    list_display = ('get_recurring_name', 'payment_date', 'month', 'year')

    @admin.display(description='Despesa Recorrente')
    def get_recurring_name(self, obj):
        return obj.recurring_expense.name
