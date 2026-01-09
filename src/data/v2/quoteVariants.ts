
import { CostItem, calculateQuote, QuoteCalculations } from "../costEngine";

export interface QuoteVariant {
    id: string;
    type: 'Conservative' | 'Standard' | 'Premium';
    description: string;
    items: CostItem[];
    calculations: QuoteCalculations;
}

export const generateVariants = (standardItems: CostItem[], profitMargin: number): QuoteVariant[] => {
    // Standard
    const standardCalc = calculateQuote(standardItems, profitMargin);

    // Conservative: Reduce scope (remove optional), lower margin (-5%)
    // For MVP, since we don't have "optional" flags widely used yet, 
    // we'll simulate by lowering labor hours by 20% (assuming efficiency) and margin.
    const conservativeItems = standardItems.map(item => {
        if (item.category === 'labor' && item.type === 'hourly') {
            return { ...item, quantity: Math.max(1, (item.quantity || 0) * 0.8) };
        }
        return item;
    });
    const conservativeCalc = calculateQuote(conservativeItems, Math.max(10, profitMargin - 5));

    // Premium: Add "Premium Support" item, increase margin (+5%), buffer labor (+20%)
    const premiumItems = standardItems.map(item => {
        if (item.category === 'labor' && item.type === 'hourly') {
            return { ...item, quantity: (item.quantity || 0) * 1.2 };
        }
        return item;
    });

    // Add a Premium specific item
    premiumItems.push({
        id: 'premium-support',
        name: 'Priority Support & Consulting',
        description: '24/7 access and strategy calls',
        category: 'labor',
        type: 'fixed',
        rate: standardCalc.totalPrice * 0.15, // 15% of standard price
        quantity: 1,
        isSelected: true
    });

    const premiumCalc = calculateQuote(premiumItems, profitMargin + 5);

    return [
        {
            id: 'conservative',
            type: 'Conservative',
            description: 'Essential scope, lean timeline, lower cost.',
            items: conservativeItems,
            calculations: conservativeCalc
        },
        {
            id: 'standard',
            type: 'Standard',
            description: 'Recommended scope for best results.',
            items: standardItems,
            calculations: standardCalc
        },
        {
            id: 'premium',
            type: 'Premium',
            description: 'All-inclusive with priority support and extra buffer.',
            items: premiumItems,
            calculations: premiumCalc
        }
    ];
};
