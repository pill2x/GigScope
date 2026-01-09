
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGigScope } from "../context/GigScopeContext";
import { industries } from "../data/industryData";
import { cn } from "@/lib/utils";

export const IndustrySelector = () => {
    const { selectedIndustry, setSelectedIndustry } = useGigScope();

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {industries.map((industry) => {
                    const Icon = industry.icon;
                    return (
                        <Card
                            key={industry.id}
                            className={cn(
                                "cursor-pointer group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/40 backdrop-blur-md",
                                selectedIndustry?.id === industry.id
                                    ? "border-primary bg-primary/5 shadow-primary/10"
                                    : "border-border/50 hover:border-primary/50"
                            )}
                            onClick={() => setSelectedIndustry(industry)}
                        >
                            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-primary to-transparent")} />

                            <CardHeader className="p-6 text-center space-y-4">
                                <div className={cn("mx-auto p-4 rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300", selectedIndustry?.id === industry.id && "bg-primary/20 text-primary")}>
                                    <Icon className="h-8 w-8" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold mb-1">{industry.name}</CardTitle>
                                    <CardDescription className="text-sm text-balance leading-relaxed">
                                        {industry.description}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    );
                })}
            </div>

            <p className="text-center text-sm text-muted-foreground pt-8 italic">
                Don't see your industry? Pick the closest match — you can customize everything later.
            </p>
        </div>
    );
};
