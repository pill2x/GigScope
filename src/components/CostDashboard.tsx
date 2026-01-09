
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useGigScope } from "../context/GigScopeContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const CostDashboard = () => {
    const { calculations, settings, setSettings, formatPrice } = useGigScope();
    const {
        subtotalLabor, subtotalMaterials, subtotalSoftware, subtotalOverhead,
        totalCost, profitAmount, totalPrice
    } = calculations;

    const data = [
        { name: 'Labor', value: subtotalLabor, color: '#3b82f6' }, // blue-500
        { name: 'Materials', value: subtotalMaterials, color: '#10b981' }, // emerald-500
        { name: 'Software', value: subtotalSoftware, color: '#8b5cf6' }, // violet-500
        { name: 'Overhead', value: subtotalOverhead, color: '#f59e0b' }, // amber-500
    ].filter(item => item.value > 0);

    return (
        <div className="space-y-6 sticky top-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <Card className="shadow-lg border-primary/20 bg-card">
                <CardHeader className="bg-muted/20 pb-4">
                    <CardTitle>Pricing Summary</CardTitle>
                    <CardDescription>Real-time calculation</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    {/* Donut Chart Visualization */}
                    {totalCost > 0 && (
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatPrice(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Breakdown */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Labor
                            </span>
                            <span>{formatPrice(subtotalLabor)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Materials
                            </span>
                            <span>{formatPrice(subtotalMaterials)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-500"></span> Software
                            </span>
                            <span>{formatPrice(subtotalSoftware)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Overhead
                            </span>
                            <span>{formatPrice(subtotalOverhead)}</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Profit Margin Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Profit Margin</Label>
                            <span className="text-sm font-semibold">{settings.profitMargin}%</span>
                        </div>
                        <Slider
                            value={[settings.profitMargin]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(val) => setSettings({ ...settings, profitMargin: val[0] })}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Cost: {formatPrice(totalCost)}</span>
                            <span className="text-success font-medium">Profit: {formatPrice(profitAmount)}</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xl font-bold">Total Quote</span>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-primary block">{formatPrice(totalPrice)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
