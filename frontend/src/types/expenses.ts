export type Category = {
    id: number;
    name: string;
}

export type Expense = {
    id: number;
    name: string;
    amount: string;
    due_date: string;
    payment_date: string | null;
    category: Category | null;
    paid: boolean;
}

export type ExpenseFormData = {
    name: string;
    amount: string;
    due_date: string;
    paid: boolean;
    payment_date: string | null;
    category_id: number | null;
}

export type NewCategoryData = {
    name: string;
}

export type InstallmentExpense = {
    id: number;
    name: string;
    total_amount: string;
    installments_quantity: number;
    first_due_date: string;
    category: Category | null;
}

export type NewInstallmentExpenseData = {
    name: string;
    total_amount: string;
    installments_quantity: string;
    first_due_date: string;
    category_id?: number | null;
}

export type InstallmentOrigin = {
    id: number;
    name: string;
    total_amount: string;
    installments_quantity: number;
    first_due_date: string;
    category: Category;
}

export type MonthlyExpense = {
    id: number;
    name: string;
    amount: string;
    due_date: string;
    payment_date: string | null;
    category: Category | null;
    installment_origin: InstallmentOrigin | null;
    paid: boolean;
    created_at: string;
    is_recurring: boolean;
}

export type RecurringExpense = {
    id: number;
    name: string;
    amount: string;
    due_day: number;
    category: Category | null;
    active: boolean;
    start_date: string;
    end_date: string | null;
}

export type NewRecurringExpense = {
    name: string;
    amount: string;
    due_day: number;
    category_id?: number | null | undefined;
    start_date: string;
    end_date?: string | null;
    active?: boolean;
}

export type PaidRecurringExpenseData = {
    recurring_expense_id: number;
    payment_date: string;
    month: number;
    year: number;
}