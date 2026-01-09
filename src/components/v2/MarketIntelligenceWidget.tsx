
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { useGigScope } from "@/context/GigScopeContext";
import { cn } from "@/lib/utils";

export const MarketIntelligenceWidget = () => {
    const { marketData, confidenceScore, risks, selectedIndustry } = useGigScope();

    if (!selectedIndustry) return null;

    const isHighConfidence = confidenceScore.score >= 80;
    const isMediumConfidence = confidenceScore.score >= 50 && confidenceScore.score < 80;

    return (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
            <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Market Intelligence</h3>
                        <div className="text-2xl font-bold mt-1 flex items-center gap-2">
                            {selectedIndustry.name}
                            <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 font-normal">
                                {marketData.demandLevel} Demand
                            </span>
                        </div>
                    </div>
                </div>

                {/* Confidence Meter */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Pricing Confidence Score</span>
                        <span className={cn(
                            "font-bold",
                            isHighConfidence ? "text-emerald-400" : isMediumConfidence ? "text-amber-400" : "text-rose-400"
                        )}>
                            {confidenceScore.score}/100
                        </span>
                    </div>
                    <Progress
                        value={confidenceScore.score}
                        className="h-2 bg-slate-700"
                    // Note: Progress component might need custom color logic or CSS var override, 
                    // simplified here by expecting standard behavior or class overrides if supported. 
                    />
                    <p className="text-xs text-slate-400">{confidenceScore.message}</p>
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded bg-slate-800/50 border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Avg Hourly Rate</div>
                        <div className="font-semibold text-lg">₦{marketData.avgHourlyRate.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded bg-slate-800/50 border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Inflation Impact</div>
                        <div className="font-semibold text-lg text-rose-400 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> {marketData.inflationRate}%
                        </div>
                    </div>
                </div>

                {/* Risk Alerts */}
                {risks.length > 0 && (
                    <div className="pt-2 animate-in fade-in slide-in-from-bottom-2">
                        <div className="text-xs font-bold text-amber-400 uppercase mb-2 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Risk Indicators ({risks.length})
                        </div>
                        <div className="space-y-2">
                            {risks.map(risk => (
                                <div key={risk.id} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-200 p-2 rounded">
                                    <span className="font-semibold block">{risk.message}</span>
                                    <span className="opacity-80">{risk.suggestion}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
