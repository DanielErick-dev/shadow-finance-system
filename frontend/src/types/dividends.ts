import { type Asset } from '@base/types/assets';

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
    itens: ItemDividend[]
};