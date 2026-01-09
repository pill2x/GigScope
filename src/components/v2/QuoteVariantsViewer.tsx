
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Shield, Zap, Star } from "lucide-react";
import { useGigScope } from "@/context/GigScopeContext";
import { cn } from "@/lib/utils";

export const QuoteVariantsViewer = () => {
    const {
        quoteVariants,
        activeVariantId,
        setActiveVariantId,
        formatPrice
    } = useGigScope();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quote Variants</h3>
            <div className="grid gap-4">
                {quoteVariants.map((variant) => {
                    const isActive = activeVariantId === variant.id;
                    return (
                        <Card
                            key={variant.id}
                            className={cn(
                                "cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden",
                                isActive ? "border-primary ring-1 ring-primary bg-primary/5" : "opacity-80 hover:opacity-100"
                            )}
                            onClick={() => setActiveVariantId(variant.id as any)}
                        >
                            {isActive && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg">
                                    Selected
                                </div>
                            )}
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {variant.id === 'conservative' && <Shield className="h-4 w-4 text-slate-500" />}
                                        {variant.id === 'standard' && <Zap className="h-4 w-4 text-blue-500" />}
                                        {variant.id === 'premium' && <Star className="h-4 w-4 text-amber-500" />}
                                        <CardTitle className="text-base">{variant.type}</CardTitle>
                                    </div>
                                    <span className="font-bold text-lg">{formatPrice(variant.calculations.totalPrice)}</span>
                                </div>
                                <CardDescription className="text-xs">{variant.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                    <li className="flex justify-between">
                                        <span>Items</span>
                                        <span>{variant.items.length}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Labor Hours</span>
                                        <span>{variant.items.filter(i => i.category === 'labor' && i.type === 'hourly').reduce((acc, i) => acc + (i.quantity || 0), 0)}h</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
