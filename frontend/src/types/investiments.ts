import { type Asset } from "@base/types/assets";

export type OrderType = 'BUY' | 'SELL'
   
export type CardInvestimentMonth = {
    id: number;
    month: number;
    year: number;
    itens: ItemInvestiment[];
}
export type ItemInvestiment = {
    id: number;
    asset: Asset;
    order_type: OrderType;
    quantity: string;
    unit_price: string;
    operation_date: string;
}

export type NewMonthCard = {
    month: number;
    year: number;
}

export type NewInvestimentMonthData = Omit<CardInvestimentMonth, 'id'>