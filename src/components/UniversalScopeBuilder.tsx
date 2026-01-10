import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Clock, Lightbulb, DollarSign, CloudHail, Plus, Trash2, Box, Sparkles, Wrench } from "lucide-react";
import { useGigScope } from "../context/GigScopeContext";
import { CostCategory, CostItem } from "../data/costEngine";
import { cn } from "@/lib/utils";

export const UniversalScopeBuilder = () => {
    const { scopeItems, updateScopeItem, addScopeItem, removeScopeItem, selectedIndustry, formatPrice } = useGigScope();

    // The 5 Core V1 Sections
    const sections: { key: CostCategory; label: string; icon: any; color: string }[] = [
        { key: 'labor', label: 'Labor & Services', icon: Clock, color: 'text-indigo-500' },
        { key: 'material', label: 'Materials & Inputs', icon: Box, color: 'text-emerald-500' },
        { key: 'tools', label: 'Tools & Licensing', icon: Wrench, color: 'text-blue-500' },
        { key: 'addons', label: 'Add-ons & Features', icon: Sparkles, color: 'text-amber-500' },
        { key: 'overhead', label: 'Operations & Overheads', icon: DollarSign, color: 'text-rose-500' },
    ];

    const handleQuantityChange = (id: string, val: string) => {
        const num = parseFloat(val);
        if (!isNaN(num)) {
            updateScopeItem(id, { quantity: num });
        }
    };

    const handleRateChange = (id: string, val: string) => {
        const num = parseFloat(val);
        if (!isNaN(num)) {
            updateScopeItem(id, { rate: num });
        }
    };

    const handleToggleOptional = (id: string, current: boolean) => {
        updateScopeItem(id, { isSelected: !current });
    };

    const handleAddItem = (category: CostCategory) => {
        const newItem: CostItem = {
            id: `custom-${Date.now()}`,
            name: "New Item",
            category,
            type: 'fixed',
            rate: 0,
            quantity: 1,
            description: "Custom addition",
            isSelected: true,
            isOptional: false
        };
        addScopeItem(newItem);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Project Scope: {selectedIndustry?.name || 'Custom Project'}
                </h2>
                <p className="text-muted-foreground">
                    Adjust the hours, quantities, and rates below. Add custom items to tailor the quote.
                </p>
            </div>

            {sections.map((section) => {
                const items = scopeItems.filter(i => i.category === section.key);
                // Don't hide sections even if empty, so user can add custom items

                return (
                    <Card key={section.key} className="border-none shadow-sm bg-card/40 backdrop-blur-sm overflow-hidden group">
                        <CardHeader className="bg-muted/40 pb-4 border-b border-border/40">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <section.icon className={cn("h-5 w-5", section.color)} />
                                {section.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/40">
                                {items.length === 0 && (
                                    <div className="p-8 text-center text-sm text-muted-foreground/50 italic">
                                        No items in this section.
                                    </div>
                                )}
                                {items.map((item) => (
                                    <div key={item.id} className={cn("p-4 flex flex-col md:flex-row md:items-center gap-4 transition-colors hover:bg-muted/30", !item.isSelected && item.isOptional && "opacity-60 bg-muted/10")}>

                                        {/* Actions: Select/Remove */}
                                        <div className="flex items-center gap-3">
                                            {item.isOptional ? (
                                                <input
                                                    type="checkbox"
                                                    checked={item.isSelected}
                                                    onChange={() => handleToggleOptional(item.id, item.isSelected || false)}
                                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/50 cursor-pointer"
                                                    title="Toggle this item"
                                                />
                                            ) : (
                                                <div className="w-5 h-5 flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Name & Desc */}
                                        <div className="flex-1 min-w-[200px]">
                                            <Input
                                                className="font-medium h-auto p-0 border-none bg-transparent shadow-none focus-visible:ring-0 text-foreground"
                                                value={item.name}
                                                onChange={(e) => updateScopeItem(item.id, { name: e.target.value })}
                                            />
                                            <Input
                                                className="text-xs text-muted-foreground h-auto p-0 border-none bg-transparent shadow-none focus-visible:ring-0 mt-0.5"
                                                value={item.description || ''}
                                                onChange={(e) => updateScopeItem(item.id, { description: e.target.value })}
                                                placeholder="Add description..."
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-end">
                                            {/* Quantity */}
                                            {(item.type === 'hourly' || item.type === 'unit' || item.type === 'subscription') && (
                                                <div className="flex items-center gap-2 bg-background border rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-primary/20">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                        {item.type === 'hourly' ? 'Hrs' : item.type === 'subscription' ? 'Mo' : 'Qty'}
                                                    </span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="w-12 bg-transparent text-right font-mono text-sm focus:outline-none"
                                                        value={item.quantity || 0}
                                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                        disabled={item.isOptional && !item.isSelected}
                                                    />
                                                </div>
                                            )}

                                            {/* Rate */}
                                            <div className="flex items-center gap-2 bg-background border rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-primary/20">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rate</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-20 bg-transparent text-right font-mono text-sm focus:outline-none"
                                                    value={item.rate || 0}
                                                    onChange={(e) => handleRateChange(item.id, e.target.value)}
                                                />
                                            </div>

                                            {/* Delete Custom Item */}
                                            {item.id.startsWith('custom-') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeScopeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="py-2 bg-muted/20 border-t border-border/40">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary gap-2 text-xs"
                                onClick={() => handleAddItem(section.key)}
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add {section.label} Item
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
};
