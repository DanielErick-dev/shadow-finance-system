import type { Asset } from '@base/types/assets';

export type OrderType = 'BUY' | 'SELL';

// --- Read (API response) ---
export type ItemInvestiment = {
    id: number;
    asset: Asset;
    order_type: OrderType;
    quantity: string;
    unit_price: string;
    operation_date: string;
};

export type CardInvestimentMonth = {
    id: number;
    month: number;
    year: number;
    itens: ItemInvestiment[];
};

// --- Write (API request body) ---
export type NewCardInvestiment = {
    month: number;
    year: number;
};

export type NewItemInvestiment = {
    asset_id: number;
    order_type: OrderType;
    quantity: string;
    unit_price: string;
    operation_date: string;
    card: number;
};

export type EditItemInvestiment = Omit<NewItemInvestiment, 'card'>;
