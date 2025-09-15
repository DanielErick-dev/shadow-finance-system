from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from .models import Expense, Category, InstallmentExpense, PaidRecurringExpense, RecurringExpense
from .serializer import (
    ExpenseSerializer,
    CategorySerializer,
    InstallmentExpenseSerializer,
    PaidRecurringExpenseSerializer,
    RecurringExpenseSerializer
)
from expenses.services.installment_manager_service import InstallmentExpenseService
from .mixins import UserQuerysetMixin
from .filters import ExpenseFilter
import django_filters
import datetime
from expenses.services.virtualization_logic_service import MonthlyExpenseLogic


class CategoryViewSet(UserQuerysetMixin, viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseViewSet(UserQuerysetMixin, viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = ExpenseFilter
    filter_backends = [SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['name']
    pagination_class = None

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class InstallmentExpenseViewSet(UserQuerysetMixin, viewsets.ModelViewSet):
    queryset = InstallmentExpense.objects.all()
    serializer_class = InstallmentExpenseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        service = InstallmentExpenseService(
            user=request.user,
            name=validated_data.get('name'),
            total_amount=validated_data.get('total_amount'),
            installments_quantity=validated_data.get('installments_quantity'),
            first_due_date=validated_data.get('first_due_date'),
            category=validated_data.get('category')
        )
        installment_expense = service.create()
        response_serializer = self.get_serializer(installment_expense)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class RecurringExpenseViewSet(UserQuerysetMixin, viewsets.ModelViewSet):
    queryset = RecurringExpense.objects.all()
    serializer_class = RecurringExpenseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PaidRecurringExpenseViewSet(UserQuerysetMixin, viewsets.ModelViewSet):
    queryset = PaidRecurringExpense.objects.select_related('recurring_expense').all()
    serializer_class = PaidRecurringExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(recurring_expense__user=self.request.user)

    def perform_create(self, serializer):
        recurring_expense = serializer.validated_data.get('recurring_expense')
        if recurring_expense.user != self.request.user:
            raise serializers.ValidationError('você não tem permissão para pagar esta despesa')
        serializer.save()


class MonthlyExpensesView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get(self, request, *args, **kwargs):
        try:
            year = int(request.query_params.get('due_date__year', datetime.date.today().year))
            month = int(request.query_params.get('due_date__month', datetime.date.today().month))
        except (TypeError, ValueError):
            return Response({
                'error': 'parametros de ano/mês inválidos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        logic_service = MonthlyExpenseLogic(user=request.user, year=year, month=month)
        combined_list = logic_service.get_monthly_expenses()

        return Response(combined_list)
