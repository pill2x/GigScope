
import { useState, useRef } from "react";
import { useForm, ValidationError } from '@formspree/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, Globe, FileText, Upload, X, Loader2, CheckCircle } from "lucide-react";
import { useGigScope } from "../context/GigScopeContext";
import { useToast } from "@/hooks/use-toast";

// Cloudinary configuration (keeping existing env vars)
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;

export const ClientDetails = () => {
    const {
        clientInfo, setClientInfo,
        selectedIndustry,
        calculations,
        formatPrice
    } = useGigScope();

    const { toast } = useToast();
    const [state, handleSubmit] = useForm("mnngnkop"); // Keeping the same form ID
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (field: string, value: string) => {
        setClientInfo((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
            return;
        }

        setIsUploadingLogo(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );
            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            setClientInfo((prev: any) => ({ ...prev, logoUrl: data.secure_url }));
            toast({ title: "Logo uploaded", description: "Logo updated successfully" });
        } catch (error) {
            console.error(error);
            toast({ title: "Upload failed", variant: "destructive" });
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const removeLogo = () => {
        setClientInfo((prev: any) => ({ ...prev, logoUrl: "" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Construct FormData for Formspree
        const formData = new FormData();
        formData.append("name", clientInfo.name);
        formData.append("email", clientInfo.email);
        formData.append("domain", clientInfo.domain);
        formData.append("description", clientInfo.description);
        if (clientInfo.logoUrl) formData.append("logoUrl", clientInfo.logoUrl);

        // Add Quote Details
        // Add Quote Details
        formData.append("industry", selectedIndustry?.name || "Not selected");
        formData.append("totalPrice", formatPrice(calculations.totalPrice));

        handleSubmit(formData);
    };

    if (state.succeeded) {
        return (
            <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-900">Request Sent!</h3>
                    <p className="text-green-700">We'll be in touch regarding your project: {selectedIndustry?.name}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Client Information</h2>
                <p className="text-muted-foreground">Who is this quote for?</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                    <CardDescription>Enter your details to generate a personalized quote</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={clientInfo.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="pl-10"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={clientInfo.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="pl-10"
                                        placeholder="john@example.com"
                                        required
                                    />
                                    <ValidationError prefix="Email" field="email" errors={state.errors} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="domain">Preferred Domain</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="domain"
                                    value={clientInfo.domain}
                                    onChange={(e) => handleInputChange("domain", e.target.value)}
                                    className="pl-10"
                                    placeholder="example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Company Logo (Optional)</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                    id="logo-upload"
                                    disabled={isUploadingLogo}
                                />
                                <label htmlFor="logo-upload" className="cursor-pointer">
                                    {clientInfo.logoUrl ? (
                                        <div className="relative inline-block">
                                            <img src={clientInfo.logoUrl} alt="Logo" className="h-20 object-contain" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); removeLogo(); }}
                                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <Upload className="h-8 w-8" />
                                            <span>{isUploadingLogo ? "Uploading..." : "Click to upload logo"}</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Project Description</Label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Textarea
                                    id="description"
                                    value={clientInfo.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    className="pl-10 min-h-[100px]"
                                    placeholder="Tell us about your project..."
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={state.submitting}>
                            {state.submitting ? <Loader2 className="animate-spin mr-2" /> : <Mail className="mr-2 h-4 w-4" />}
                            Submit Quote Request
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
