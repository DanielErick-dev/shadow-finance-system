from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from .models import Expense, Category, InstallmentExpense, PaidRecurringExpense, RecurringExpense


class CategorySerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Category
        fields = ['id', 'name', 'user']
        validators = [
            UniqueTogetherValidator(
                queryset=Category.objects.all(),
                fields=['user', 'name'],
                message='Você já possui uma categoria com este nome.',
            )
        ]


class InstallmentExpenseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        allow_null=True,
        required=False
    )

    class Meta:
        model = InstallmentExpense
        fields = [
            'id',
            'name',
            'total_amount',
            'installments_quantity',
            'first_due_date',
            'category',
            'category_id'
        ]


class ExpenseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        allow_null=True,
        required=False
    )
    installment_origin = InstallmentExpenseSerializer(read_only=True, allow_null=True)

    class Meta:
        model = Expense
        fields = [
            'id',
            'name',
            'amount',
            'due_date',
            'payment_date',
            'category',
            'category_id',
            'installment_origin',
            'paid',
            'created_at'
        ]


class RecurringExpenseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        allow_null=True,
        required=False
    )

    class Meta:
        model = RecurringExpense
        fields = [
            'id',
            'name',
            'amount',
            'due_day',
            'start_date',
            'end_date',
            'active',
            'category',
            'category_id',
        ]


class PaidRecurringExpenseSerializer(serializers.ModelSerializer):
    recurring_expense_id = serializers.PrimaryKeyRelatedField(
        queryset=RecurringExpense.objects.all(),
        source='recurring_expense',
        write_only=True
    )

    class Meta:
        model = PaidRecurringExpense
        fields = [
            'id',
            'recurring_expense_id',
            'payment_date',
            'month',
            'year'
        ]
