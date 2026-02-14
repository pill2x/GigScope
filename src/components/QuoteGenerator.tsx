
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Shield, Zap, Crown } from "lucide-react";
import { useGigScope } from "../context/GigScopeContext";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

// Sub-component for individual price animation
const AnimatedPrice = ({ price, format }: { price: number, format: (p: number) => string }) => {
    const [value, setValue] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        // If we've already animated once, just set the value instantly to avoid re-rolling on small updates
        // actually, user said "loading... spin down like it refreshed". 
        // Let's assume on MOUNT of this component (page load), it should animate.

        let startTimestamp: number | null = null;
        const duration = 1000;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            setValue(progress === 1 ? price : Math.round(price * ease));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, []); // Empty dependency array = run only on mount

    // If price changes after mount, we update instantly or we could animate. 
    // User request implies "on load". Let's update if prop changes but maybe no animation?
    // Actually, if data changes, we probably want to see the new number. 
    // But the loop above runs once. Let's sync state if price prop changes.
    useEffect(() => {
        if (value !== price && value !== 0) { // skip if it's the initial 0
            setValue(price);
        }
    }, [price]);

    return <>{format(value)}</>;
};

export const QuoteGenerator = () => {
    const {
        selectedIndustry,
        formatPrice,
        quoteVariants,
        activeVariantId,
        setActiveVariantId
    } = useGigScope();

    const handlePrint = () => {
        window.print();
    };

    if (!selectedIndustry) return null;

    const activeVariant = quoteVariants.find(v => v.id === activeVariantId) || quoteVariants[0];

    // Icons for tiers
    const getTierIcon = (id: string) => {
        switch (id) {
            case 'conservative': return <Shield className="h-5 w-5" />;
            case 'standard': return <Zap className="h-5 w-5" />;
            case 'premium': return <Crown className="h-5 w-5" />;
            default: return <Zap className="h-5 w-5" />;
        }
    };

    const getTierColor = (id: string) => {
        switch (id) {
            case 'conservative': return "text-slate-600 bg-slate-100 border-slate-200";
            case 'standard': return "text-primary bg-primary/10 border-primary/20";
            case 'premium': return "text-amber-500 bg-amber-500/10 border-amber-200";
            default: return "text-slate-500";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-3xl font-bold">Your Estimated Quote</h2>
                <p className="text-muted-foreground">
                    Based on your scope, we've calculated three pricing tiers.
                    Choose the one that fits your strategy.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {quoteVariants.map((variant) => {
                    const isSelected = activeVariantId === variant.id;

                    // Specific hour calculation
                    const variantHours = Math.round(variant.items
                        .filter(i => i.category === 'labor' && i.type === 'hourly' && (i.isSelected ?? true))
                        .reduce((acc, curr) => acc + (curr.quantity || 0), 0));

                    return (
                        <Card
                            key={variant.id}
                            className={cn(
                                "relative transition-all duration-300 hover:shadow-xl cursor-pointer border-2",
                                isSelected
                                    ? "border-primary shadow-primary/20 scale-105 z-10"
                                    : "border-border/50 opacity-80 hover:opacity-100 hover:border-primary/50"
                            )}
                            onClick={() => setActiveVariantId(variant.id as any)}
                        >
                            {isSelected && (
                                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                    <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                                        Selected Option
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-2">
                                <div className={cn("mx-auto p-3 rounded-full w-fit mb-3", getTierColor(variant.id))}>
                                    {getTierIcon(variant.id)}
                                </div>
                                <CardTitle className="capitalize text-xl">{variant.type}</CardTitle>
                                <CardDescription className="h-10 text-balance">
                                    {variant.id === 'conservative' && "Minimum viable scope. Good for tight budgets."}
                                    {variant.id === 'standard' && "Recommended scope. Balanced value and quality."}
                                    {variant.id === 'premium' && "Full scope with bells & whistles. value-based."}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="text-center pt-4 pb-6">
                                <div className="text-3xl font-bold text-foreground tabular-nums">
                                    <AnimatedPrice price={variant.calculations.totalPrice} format={formatPrice} />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Estimated Total</div>

                                <div className="mt-6 space-y-2 text-sm text-left px-4">
                                    <div className="flex justify-between items-center py-1 border-b border-border/50">
                                        <span className="text-muted-foreground">Est. Effort</span>
                                        <span className="font-medium text-foreground">
                                            {variantHours} hours
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-border/50">
                                        <span className="text-muted-foreground">Labor</span>
                                        <span className="font-medium text-foreground">{formatPrice(variant.calculations.subtotalLabor)}</span>
                                    </div>
                                    {variant.calculations.subtotalMaterials > 0 && (
                                        <div className="flex justify-between items-center py-1 border-b border-border/50">
                                            <span className="text-muted-foreground">Materials</span>
                                            <span className="font-medium text-foreground">{formatPrice(variant.calculations.subtotalMaterials)}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={isSelected ? "default" : "outline"}
                                >
                                    {isSelected ? "Selected" : "Select This Plan"}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Export Section */}
            <div className="bg-muted/30 rounded-xl p-8 max-w-3xl mx-auto border text-center space-y-4">
                <h3 className="text-xl font-semibold">Ready to send?</h3>
                <p className="text-muted-foreground">
                    Export your <strong>{activeVariant?.type}</strong> quote as a clean, professional PDF.
                </p>
                <div className="flex justify-center gap-4">
                    <Button size="lg" className="gap-2" onClick={handlePrint}>
                        <Download className="h-4 w-4" />
                        Export PDF Quote
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                    Tip: Use your browser's "Save as PDF" option.
                </p>
            </div>

            {/* Hidden Printable Area */}
            <div className="hidden print:block fixed inset-0 bg-white z-[100] p-12 text-black">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="flex justify-between items-start border-b pb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">QUOTE</h1>
                            <div className="text-gray-500 uppercase tracking-widest text-sm font-semibold">{activeVariant?.type} Plan</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-indigo-600">GigScope</div>
                            <div className="text-sm text-gray-500">Estimator Tool</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Scope Summary</h3>
                            <p className="text-gray-600">{selectedIndustry.name} Project</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-bold text-gray-900 mb-2">Estimate Total</h3>
                            <p className="text-3xl font-bold text-indigo-600">{formatPrice(activeVariant?.calculations.totalPrice || 0)}</p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <h3 className="font-bold border-b pb-2 mb-4">Itemized Breakdown</h3>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-gray-600">Item</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {activeVariant?.items.filter(i => i.isSelected).map(item => (
                                    <tr key={item.id}>
                                        <td className="p-3">
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.type === 'hourly' ? `${item.quantity} hours` : 'Fixed price'}</div>
                                        </td>
                                        <td className="p-3 text-right font-medium text-gray-900">
                                            {formatPrice((item.rate || 0) * (item.quantity || 1))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-12 pt-8 border-t text-sm text-gray-500 text-center">
                        Generated by GigScope • gigscope.app
                    </div>
                </div>
            </div>
        </div>
    );
};
