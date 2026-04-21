export type AssetType = 'FII' | 'ACAO' | 'ETF' | 'BDR';

// --- Read (API response) ---
export type Asset = {
    id: number;
    code: string;
    type: AssetType;
};

// --- Write (API request body) ---
export type NewAsset = {
    code: string;
    type: AssetType;
};
