
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { useGigScope } from "@/context/GigScopeContext";
import { useToast } from "@/hooks/use-toast";

export const NegotiationAssistant = () => {
    const { activeVariantId, quoteVariants, formatPrice, selectedIndustry } = useGigScope();
    const { toast } = useToast();

    const activeVariant = quoteVariants.find(v => v.id === activeVariantId);
    if (!activeVariant) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: "Script copied to clipboard." });
    };

    const getScript = (type: string) => {
        const price = formatPrice(activeVariant.calculations.totalPrice);
        const industry = selectedIndustry?.name || "service";

        switch (type) {
            case 'initial':
                return `Hi [Client Name],\n\nBased on our discussion, I've put together a ${activeVariant.type.toLowerCase()} proposal for your ${industry} project.\n\nThe total investment is ${price}. This includes ${activeVariant.description}\n\nI'm confident this covers everything we need to succeed. Let me know if you'd like to proceed!\n\nBest,\n[Your Name]`;
            case 'defense':
                return `Hi [Client Name],\n\nI understand budget is a concern. The ${price} quote reflects the quality and reliability required for a project of this scope in the current market.\n\nIf we need to lower the investment, I can switch to a "Conservative" scope which removes some optional items. Let me know if you'd like to explore that.`;
            case 'upsell':
                return `Hi [Client Name],\n\nI noticed you selected the Standard package. For just a bit more, the Premium option (${price}) includes priority support and faster delivery, which might be valuable for your timeline.\n\nWould you like to see the difference?`;
            default: return "";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Negotiation Assistant</CardTitle>
                <CardDescription>AI-generated scripts to help you close.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="initial">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="initial">Initial</TabsTrigger>
                        <TabsTrigger value="defense">Defend Price</TabsTrigger>
                        <TabsTrigger value="upsell">Upsell</TabsTrigger>
                    </TabsList>
                    <div className="mt-4 relative bg-muted p-4 rounded-md">
                        <TabsContent value="initial" className="mt-0 text-sm whitespace-pre-wrap">{getScript('initial')}</TabsContent>
                        <TabsContent value="defense" className="mt-0 text-sm whitespace-pre-wrap">{getScript('defense')}</TabsContent>
                        <TabsContent value="upsell" className="mt-0 text-sm whitespace-pre-wrap">{getScript('upsell')}</TabsContent>

                        <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-6 w-6" onClick={() => {
                            const activeTab = document.querySelector('[data-state="active"][role="tabpanel"]');
                            if (activeTab) copyToClipboard(activeTab.textContent || "");
                        }}>
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
};
