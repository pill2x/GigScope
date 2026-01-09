
import { CostItem } from "../costEngine";
import { ScopeDetails } from "../../context/GigScopeContext";

export interface MarketData {
    industryId: string;
    avgHourlyRate: number;
    p90HourlyRate: number;
    inflationRate: number; // Percentage
    demandLevel: 'Low' | 'Medium' | 'High' | 'Very High';
}

export const marketDatabase: Record<string, MarketData> = {
    'web-dev': {
        industryId: 'web-dev',
        avgHourlyRate: 15000,
        p90HourlyRate: 25000,
        inflationRate: 12,
        demandLevel: 'Very High'
    },
    'graphic-design': {
        industryId: 'graphic-design',
        avgHourlyRate: 10000,
        p90HourlyRate: 18000,
        inflationRate: 8,
        demandLevel: 'Medium'
    },
    'photography': {
        industryId: 'photography',
        avgHourlyRate: 20000,
        p90HourlyRate: 35000,
        inflationRate: 5,
        demandLevel: 'Medium'
    },
    'catering': {
        industryId: 'catering',
        avgHourlyRate: 8000,
        p90HourlyRate: 15000,
        inflationRate: 15, // Food costs
        demandLevel: 'High'
    }
    // Fallback for others
};

export const getMarketData = (industryId: string): MarketData => {
    return marketDatabase[industryId] || {
        industryId,
        avgHourlyRate: 10000,
        p90HourlyRate: 20000,
        inflationRate: 5,
        demandLevel: 'Medium'
    };
};

export const calculateConfidenceScore = (
    userItems: CostItem[],
    marketData: MarketData
): { score: number; status: 'Low' | 'Medium' | 'High'; message: string } => {

    // Calculate user's effective hourly rate
    const laborItems = userItems.filter(i => i.category === 'labor' && i.isSelected && i.type === 'hourly');
    if (laborItems.length === 0) return { score: 100, status: 'High', message: 'No labor items to benchmark.' };

    const totalRate = laborItems.reduce((sum, item) => sum + (item.rate || 0), 0);
    const avgUserRate = totalRate / laborItems.length;

    const variance = Math.abs(avgUserRate - marketData.avgHourlyRate) / marketData.avgHourlyRate;

    // Confidence Score Logic (Inverse of variance)
    // 0% variance = 100 score
    // 50% variance = 50 score
    let score = Math.max(0, 100 - (variance * 100));

    let status: 'Low' | 'Medium' | 'High' = 'High';
    let message = "Your rates align with the market average.";

    if (score < 50) {
        status = 'Low';
        message = avgUserRate > marketData.avgHourlyRate
            ? "Your rates are significantly above market average."
            : "Your rates are significantly below market average.";
    } else if (score < 80) {
        status = 'Medium';
        message = avgUserRate > marketData.avgHourlyRate
            ? "Your rates are slightly high (Premium)."
            : "Your rates are competitive but lower than average.";
    }

    return { score: Math.round(score), status, message };
};

export interface RiskIndicator {
    id: string;
    level: 'warning' | 'critical';
    message: string;
    suggestion: string;
}

export const analyzeRisk = (scopeDetails: ScopeDetails, items: CostItem[]): RiskIndicator[] => {
    const risks: RiskIndicator[] = [];

    // 1. Timeline Risk
    if (!scopeDetails.timeline) {
        risks.push({
            id: 'no-timeline',
            level: 'critical',
            message: 'No timeline specified.',
            suggestion: 'Define a timeline to avoid scope creep.'
        });
    } else if (scopeDetails.timeline.toLowerCase().includes('day') && items.length > 5) {
        risks.push({
            id: 'tight-timeline',
            level: 'warning',
            message: 'Timeline seems very short for the number of items.',
            suggestion: 'Consider extending to 1 week minimum.'
        });
    }

    // 2. Budget/Scope Risk
    const hasAssumptions = scopeDetails.assumptions.length > 0;
    if (!hasAssumptions) {
        risks.push({
            id: 'no-assumptions',
            level: 'warning',
            message: 'No assumptions/exclusions listed.',
            suggestion: 'List what is NOT included to prevent disputes.'
        });
    }

    return risks;
};
