
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Clock, Lightbulb, DollarSign, CloudHail } from "lucide-react";
import { useGigScope } from "../context/GigScopeContext";
import { CostCategory, CostItem } from "../data/costEngine";
import { cn } from "@/lib/utils";

export const UniversalScopeBuilder = () => {
    const { scopeItems, updateScopeItem, selectedIndustry } = useGigScope();

    // Group items by category
    const categories: Record<string, typeof scopeItems> = {
        'Labor & Service': scopeItems.filter(i => i.category === 'labor'),
        'Materials & Assets': scopeItems.filter(i => i.category === 'material'),
        'Software & Licensing': scopeItems.filter(i => i.category === 'software'),
        'Other Costs': scopeItems.filter(i => i.category === 'overhead' || i.category === 'fixed'),
    };

    const handleQuantityChange = (id: string, val: string) => {
        const num = parseFloat(val);
        if (!isNaN(num)) {
            updateScopeItem(id, { quantity: num });
        }
    };

    const handleToggleOptional = (id: string, current: boolean) => {
        updateScopeItem(id, { isSelected: !current });
    };

    const EmptyState = () => (
        <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
            <CloudHail className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-muted-foreground">Your scope is empty</h3>
            <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto">
                No items in this template? Try selecting a different industry or check back later.
            </p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Project Scope: {selectedIndustry?.name || 'Custom Project'}
                </h2>
                <p className="text-muted-foreground">
                    Adjust the hours, quantities, and items below to match your specific project needs.
                </p>
            </div>

            {scopeItems.length === 0 ? <EmptyState /> : Object.entries(categories).map(([categoryName, items]) => {
                if (items.length === 0) return null;

                return (
                    <Card key={categoryName} className="border-none shadow-sm bg-card/40 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="bg-muted/40 pb-4 border-b border-border/40">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                {categoryName === 'Labor & Service' && <Clock className="h-5 w-5 text-indigo-500" />}
                                {categoryName === 'Materials & Assets' && <GripVertical className="h-5 w-5 text-emerald-500" />}
                                {categoryName === 'Software & Licensing' && <Lightbulb className="h-5 w-5 text-amber-500" />}
                                {categoryName === 'Other Costs' && <DollarSign className="h-5 w-5 text-rose-500" />}
                                {categoryName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/40">
                                {items.map((item) => (
                                    <div key={item.id} className={cn("p-4 flex flex-col md:flex-row md:items-center gap-4 transition-colors hover:bg-muted/30", !item.isSelected && item.isOptional && "opacity-60 bg-muted/10")}>

                                        {/* Checkbox for Optional Items */}
                                        {item.isOptional && (
                                            <div className="flex items-center h-full">
                                                <input
                                                    type="checkbox"
                                                    checked={item.isSelected}
                                                    onChange={() => handleToggleOptional(item.id, item.isSelected || false)}
                                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/50"
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <h4 className="font-medium text-foreground">{item.name}</h4>
                                            {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {/* Quantity / Hours Input */}
                                            {(item.type === 'hourly' || item.type === 'unit' || item.type === 'subscription') && (
                                                <div className="flex items-center gap-2 bg-background border rounded-md px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
                                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                        {item.type === 'hourly' ? 'Hours' : item.type === 'subscription' ? 'Months' : 'Qty'}
                                                    </span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="w-16 bg-transparent text-right font-mono text-sm focus:outline-none"
                                                        value={item.quantity || 0}
                                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                        disabled={item.isOptional && !item.isSelected}
                                                    />
                                                </div>
                                            )}

                                            {/* Fixed Price Display (if fixed) */}
                                            {item.type === 'fixed' && (
                                                <div className="text-sm font-mono text-muted-foreground font-medium">
                                                    Fixed Cost
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
