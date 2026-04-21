import type { Asset } from '@base/types/assets';

// --- Read (API response) ---
export type ItemDividend = {
    id: number;
    asset: Asset;
    value: string;
    received_date: string;
};

export type DividendMonth = {
    id: number;
    month: number;
    year: number;
    itens: ItemDividend[];
};

// --- Write (API request body) ---
export type NewDividendMonth = {
    month: number;
    year: number;
};

export type NewItemDividend = {
    asset_id: number;
    value: string;
    received_date: string;
    card_month: number;
};

export type EditItemDividend = Omit<NewItemDividend, 'card_month'>;
