// --- Shared ---
export type Category = {
    id: number;
    name: string;
};

export type ExpenseType = 'simple' | 'installment' | 'recurring';

// --- InstallmentExpense ---

// Read
export type InstallmentExpense = {
    id: number;
    name: string;
    total_amount: string;
    installments_quantity: number;
    first_due_date: string;
    category: Category | null;
};

// Write
export type NewInstallmentExpenseData = {
    name: string;
    total_amount: string;
    installments_quantity: string;
    first_due_date: string;
    category_id: number | null;
};

// --- Expense ---

// Read
export type Expense = {
    id: number;
    name: string;
    amount: string;
    due_date: string;
    payment_date: string | null;
    category: Category | null;
    installment_origin: InstallmentExpense | null;
    paid: boolean;
    created_at: string;
};

// Write
export type ExpenseFormData = {
    name: string;
    amount: string;
    due_date: string;
    paid: boolean;
    payment_date: string | null;
    category_id: number | null;
};

// Monthly view (virtual union of Expense + virtual RecurringExpense entries)
export type MonthlyExpense = Expense & {
    is_recurring: boolean;
    expense_type: ExpenseType;
};

// --- Category ---

export type NewCategoryData = {
    name: string;
};

// --- RecurringExpense ---

// Read
export type RecurringExpense = {
    id: number;
    name: string;
    amount: string;
    due_day: number;
    category: Category | null;
    active: boolean;
    start_date: string;
    end_date: string | null;
};

// Write
export type NewRecurringExpense = {
    name: string;
    amount: string;
    due_day: number;
    category_id: number | null;
    start_date: string;
    end_date: string | null;
    active: boolean;
};

// --- PaidRecurringExpense ---

export type PaidRecurringExpenseData = {
    recurring_expense_id: number;
    payment_date: string;
    month: number;
    year: number;
};
