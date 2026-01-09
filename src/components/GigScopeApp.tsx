
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndustrySelector } from "./IndustrySelector";
import { UniversalScopeBuilder } from "./UniversalScopeBuilder";
import { QuoteGenerator } from "./QuoteGenerator";
import { GigSpaceLink } from "./GigSpaceLink";
import { GigScopeProvider, useGigScope } from "@/context/GigScopeContext";
import { cn } from "@/lib/utils";

const GigScopeContent = () => {
    const { selectedIndustry, calculations, setSelectedIndustry } = useGigScope();
    const [step, setStep] = useState<"industry" | "scope" | "pricing">("industry");

    // Auto-advance when industry is selected
    useEffect(() => {
        if (selectedIndustry && step === "industry") {
            setStep("scope");
        }
    }, [selectedIndustry, step]);

    // Go back handler
    const handleBack = () => {
        if (step === "pricing") setStep("scope");
        if (step === "scope") {
            setSelectedIndustry(undefined);
            setStep("industry");
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep("industry")}>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">G</div>
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">GigScope</h1>
                    </div>
                    {/* Progress Indicator */}
                    <div className="hidden md:flex items-center gap-2 text-sm font-medium">
                        <span className={cn("transition-colors", step === "industry" ? "text-primary" : "text-muted-foreground")}>1. Industry</span>
                        <span className="text-muted-foreground/30">→</span>
                        <span className={cn("transition-colors", step === "scope" ? "text-primary" : "text-muted-foreground")}>2. Details</span>
                        <span className="text-muted-foreground/30">→</span>
                        <span className={cn("transition-colors", step === "pricing" ? "text-primary" : "text-muted-foreground")}>3. Quote</span>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-5xl">

                {/* Back Button */}
                {step !== "industry" && (
                    <button
                        onClick={handleBack}
                        className="mb-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                        ← Back
                    </button>
                )}

                <div className="space-y-8">
                    {step === "industry" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-10 max-w-2xl mx-auto">
                                <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                                    Pricing made <span className="text-primary">human</span>.
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Choose your industry to generate a quick, fair, and professional quote in seconds.
                                </p>
                            </div>
                            <IndustrySelector />
                        </div>
                    )}

                    {step === "scope" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <UniversalScopeBuilder />
                            <div className="flex justify-end pt-4">
                                <Button size="lg" onClick={() => setStep("pricing")} className="w-full md:w-auto text-lg px-8 h-12 shadow-xl shadow-primary/20">
                                    Calculate Price
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === "pricing" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <QuoteGenerator />
                            <div className="mt-8 flex justify-center">
                                <Button variant="outline" onClick={() => setStep("scope")}>
                                    Edit Details
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-20 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <GigSpaceLink />
                    <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} GigScope</p>
                </div>
            </div>
        </div>
    );
};

export const GigScopeApp = () => {
    return (
        <GigScopeProvider>
            <GigScopeContent />
        </GigScopeProvider>
    );
};
