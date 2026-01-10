
export type CostCategory = 'labor' | 'material' | 'tools' | 'addons' | 'overhead' | 'fixed';

export interface CostItem {
    id: string;
    name: string;
    description?: string;
    category: CostCategory;

    // Pricing Model
    type: 'hourly' | 'fixed' | 'unit' | 'subscription';

    // Values
    rate?: number; // per hour, per unit, or fixed price
    quantity?: number; // hours, units, months

    // Meta
    isOptional?: boolean;
    isSelected?: boolean;
}

export interface QuoteCalculations {
    subtotalLabor: number;
    subtotalMaterials: number;
    subtotalTools: number;
    subtotalAddons: number;
    subtotalOverhead: number;
    totalCost: number;
    profitAmount: number;
    totalPrice: number;
}

export const calculateQuote = (items: CostItem[], profitMarginPercent: number): QuoteCalculations => {
    let subtotalLabor = 0;
    let subtotalMaterials = 0;
    let subtotalTools = 0;
    let subtotalAddons = 0;
    let subtotalOverhead = 0;

    items.forEach(item => {
        if (item.isOptional && !item.isSelected) return;

        let cost = 0;
        const qty = item.quantity || 1;
        const rate = item.rate || 0;

        switch (item.type) {
            case 'hourly':
            case 'unit':
            case 'subscription':
                cost = rate * qty;
                break;
            case 'fixed':
                cost = rate;
                break;
        }

        switch (item.category) {
            case 'labor': subtotalLabor += cost; break;
            case 'material': subtotalMaterials += cost; break;
            case 'tools': subtotalTools += cost; break;
            case 'addons': subtotalAddons += cost; break;
            case 'overhead': subtotalOverhead += cost; break;
            default: subtotalLabor += cost; // Fallback
        }
    });

    const totalCost = subtotalLabor + subtotalMaterials + subtotalTools + subtotalAddons + subtotalOverhead;
    const profitAmount = totalCost * (profitMarginPercent / 100);
    const totalPrice = totalCost + profitAmount;

    return {
        subtotalLabor,
        subtotalMaterials,
        subtotalTools,
        subtotalAddons,
        subtotalOverhead,
        totalCost,
        profitAmount,
        totalPrice
    };
};
