from .views import (
    ExpenseViewSet,
    CategoryViewSet,
    InstallmentExpenseViewSet,
    RecurringExpenseViewSet,
    PaidRecurringExpenseViewSet,
    MonthlyExpensesView
)
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='expense-category')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'installments', InstallmentExpenseViewSet, basename='installment-expense')
router.register(r'recurring', RecurringExpenseViewSet, basename='recurring-expense')
router.register(r'paid-recurring', PaidRecurringExpenseViewSet, basename='paid-recurring')


urlpatterns = [
    path('monthly-view/', MonthlyExpensesView.as_view(), name='monthly-expenses-view'),
    path('', include(router.urls))
]
