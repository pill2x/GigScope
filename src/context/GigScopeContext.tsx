
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Industry, industries } from '../data/industryData';
import { CostItem, calculateQuote, QuoteCalculations } from '../data/costEngine';
import {
    MarketData,
    getMarketData,
    calculateConfidenceScore,
    analyzeRisk,
    RiskIndicator
} from '../data/v2/marketIntelligence';
import { QuoteVariant, generateVariants } from '../data/v2/quoteVariants';

interface GlobalSettings {
    currency: string;
    profitMargin: number; // Percentage
    taxRate: number; // Percentage
}

interface ClientInfo {
    name: string;
    email: string;
    domain: string;
    description: string;
    logoUrl?: string;
}

export interface ScopeDetails {
    timeline: string;
    deliverables: string[]; // These can be text-only deliverables separate from cost items if needed, or we can unify.
    assumptions: string[];
}

interface GigScopeContextType {
    // Selection
    selectedIndustry: Industry | undefined;
    setSelectedIndustry: (industry: Industry | undefined) => void;

    // Scope & Costs
    scopeItems: CostItem[];
    setScopeItems: React.Dispatch<React.SetStateAction<CostItem[]>>;
    addScopeItem: (item: CostItem) => void;
    removeScopeItem: (id: string) => void;
    updateScopeItem: (id: string, updates: Partial<CostItem>) => void;

    // Meta Scope
    scopeDetails: ScopeDetails;
    setScopeDetails: React.Dispatch<React.SetStateAction<ScopeDetails>>;

    // Global Settings
    settings: GlobalSettings;
    setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;

    // Calculations
    calculations: QuoteCalculations;

    // Client
    clientInfo: ClientInfo;
    setClientInfo: React.Dispatch<React.SetStateAction<ClientInfo>>;

    // V2 Intelligence
    marketData: MarketData;
    confidenceScore: { score: number; status: 'Low' | 'Medium' | 'High'; message: string };
    risks: RiskIndicator[];
    quoteVariants: QuoteVariant[];
    activeVariantId: string;
    setActiveVariantId: (id: 'conservative' | 'standard' | 'premium') => void;

    // Helpers
    formatPrice: (price: number) => string;
}

const GigScopeContext = createContext<GigScopeContextType | undefined>(undefined);

export const useGigScope = () => {
    const context = useContext(GigScopeContext);
    if (!context) {
        throw new Error('useGigScope must be used within a GigScopeProvider');
    }
    return context;
};

export const GigScopeProvider = ({ children }: { children: ReactNode }) => {
    // State
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | undefined>(undefined);
    const [scopeItems, setScopeItems] = useState<CostItem[]>([]);
    const [scopeDetails, setScopeDetails] = useState<ScopeDetails>({
        timeline: "",
        deliverables: [],
        assumptions: []
    });
    const [settings, setSettings] = useState<GlobalSettings>({
        currency: 'NGN',
        profitMargin: 20,
        taxRate: 0
    });
    const [clientInfo, setClientInfo] = useState<ClientInfo>({
        name: "",
        email: "",
        domain: "",
        description: "",
        logoUrl: ""
    });

    // V2 State
    const [activeVariantId, setActiveVariantId] = useState<'conservative' | 'standard' | 'premium'>('standard');

    // Effect: When industry changes, load defaults
    useEffect(() => {
        if (selectedIndustry) {
            setScopeItems([...selectedIndustry.defaultItems]);
        }
    }, [selectedIndustry]);

    // Calculations & Intelligence
    const calculations = calculateQuote(scopeItems, settings.profitMargin);

    const marketData = getMarketData(selectedIndustry?.id || 'web-dev');

    const confidenceScore = calculateConfidenceScore(scopeItems, marketData);

    const risks = analyzeRisk(scopeDetails, scopeItems);

    const quoteVariants = generateVariants(scopeItems, settings.profitMargin);

    // Actions
    const addScopeItem = (item: CostItem) => {
        setScopeItems(prev => [...prev, item]);
    };

    const removeScopeItem = (id: string) => {
        setScopeItems(prev => prev.filter(i => i.id !== id));
    };

    const updateScopeItem = (id: string, updates: Partial<CostItem>) => {
        setScopeItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const formatPrice = (price: number) => {
        return `${settings.currency} ${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    };

    return (
        <GigScopeContext.Provider value={{
            selectedIndustry,
            setSelectedIndustry,
            scopeItems,
            setScopeItems,
            addScopeItem,
            removeScopeItem,
            updateScopeItem,
            scopeDetails,
            setScopeDetails,
            settings,
            setSettings,
            calculations,
            clientInfo,
            setClientInfo,

            // V2 Exports
            marketData,
            confidenceScore,
            risks,
            quoteVariants,
            activeVariantId,
            setActiveVariantId,

            formatPrice
        }}>
            {children}
        </GigScopeContext.Provider>
    );
};

