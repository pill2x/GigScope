
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check } from "lucide-react";
import { useGigScope } from "../context/GigScopeContext";
import { websiteTypes, addOnServices, maintenancePlans } from "../data/pricingData";

export const PriceDisplay = () => {
  const {
    selectedType,
    selectedAddOns,
    selectedMaintenance,
    totalOneTimePrice,
    totalMonthlyPrice,
    formatPrice
  } = useGigScope();

  // Re-derive objects from IDs (since context exposes IDs for some but also computed values, let's just use what's consistent or reuse the helpers in context. 
  // Actually context has selectedWebsite etc exposed, let's use them.)
  // Wait, I didn't export `selectedWebsite` in context type in my previous thought? 
  // Let me check my previous tool call for GigScopeContext.
  // Yes I did: selectedWebsite, selectedMaintenancePlan are exported.

  const selectedWebsite = websiteTypes.find(t => t.id === selectedType);
  const selectedMaintenancePlan = maintenancePlans.find(m => m.id === selectedMaintenance);

  if (!selectedType) {
    return (
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>Select a project type to start calculating</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-primary/20 sticky top-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          Project Estimate
        </CardTitle>
        <CardDescription>Estimated cost breakdown</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">

        {/* Base Project */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-sm">{selectedWebsite?.name}</h4>
              <Badge variant="secondary" className="mt-1 text-xs">Base</Badge>
            </div>
            <span className="font-medium">{formatPrice(selectedWebsite?.basePrice || 0)}</span>
          </div>
        </div>

        <Separator />

        {/* Add-ons */}
        {selectedAddOns.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Add-ons</h4>
            {selectedAddOns.map(addOnId => {
              const addOn = addOnServices.find(s => s.id === addOnId);
              if (!addOn) return null;
              return (
                <div key={addOnId} className="flex justify-between text-sm">
                  <span>{addOn.name}</span>
                  <span>{formatPrice(addOn.price)}</span>
                </div>
              );
            })}
          </div>
        )}

        {selectedAddOns.length > 0 && <Separator />}

        {/* Totals */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">One-time Investment</span>
            <span className="text-xl font-bold text-primary">{formatPrice(totalOneTimePrice)}</span>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Maintenance Plan ({selectedMaintenancePlan?.name})</span>
              <span>{formatPrice(selectedMaintenancePlan?.price || 0)}/mo</span>
            </div>
            {selectedAddOns.map(addOnId => {
              const addOn = addOnServices.find(s => s.id === addOnId);
              if (!addOn || !addOn.monthlyFee) return null;
              return (
                <div key={`${addOnId}-monthly`} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{addOn.name} Fee</span>
                  <span>{formatPrice(addOn.monthlyFee)}/mo</span>
                </div>
              );
            })}
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Monthly</span>
              <span>{formatPrice(totalMonthlyPrice)}/mo</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="flex gap-2 text-xs text-muted-foreground justify-center mb-4">
            <Check className="w-3 h-3 text-primary" /> Valid for 7 days
            <Check className="w-3 h-3 text-primary" /> 50% Upfront
          </div>
        </div>
      </CardContent>
    </Card>
  );
};