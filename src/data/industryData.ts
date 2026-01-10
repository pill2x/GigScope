
import { Code, Palette, Camera, Utensils, Scissors, Wrench, Megaphone, Calendar } from "lucide-react";
import { CostItem } from "./costEngine";

export interface Industry {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultItems: CostItem[];
}

export const industries: Industry[] = [
    {
        id: "web-dev",
        name: "Web Development",
        description: "Websites, Web Apps, API Integrations",
        icon: Code,
        defaultItems: [
            { id: "wd-1", name: "Frontend Development", category: "labor", type: "hourly", rate: 35000, quantity: 40, description: "React, Tailwind, UI implementation (Senior Rate)" },
            { id: "wd-2", name: "Backend Development", category: "labor", type: "hourly", rate: 45000, quantity: 30, description: "API, Database, Auth setup (Senior Rate)" },
            { id: "wd-3", name: "Domain Name (.com)", category: "tools", type: "fixed", rate: 25000, quantity: 1, description: "Annual domain registration" },
            { id: "wd-4", name: "Cloud Hosting (Pro)", category: "tools", type: "subscription", rate: 35000, quantity: 12, description: "Vercel/AWS monthly estimate" },
            { id: "wd-5", name: "UI/UX Design Phase", category: "labor", type: "fixed", rate: 250000, quantity: 1, description: "Full Figma design package & prototyping" },
            { id: "wd-6", name: "Maintenance Plan", category: "addons", type: "subscription", rate: 50000, quantity: 12, description: "Monthly updates & backups", isOptional: true, isSelected: false },
        ]
    },
    {
        id: "design",
        name: "UI/UX & Design",
        description: "Branding, Mobile Apps, Prototypes",
        icon: Palette,
        defaultItems: [
            { id: "gd-1", name: "Professional Logo Suite", category: "labor", type: "fixed", rate: 150000, quantity: 1, description: "3 concepts, full vector exports" },
            { id: "gd-2", name: "Brand Identity Guide", category: "labor", type: "fixed", rate: 120000, quantity: 1, description: "Typography, Color Palette, Usage Rules" },
            { id: "gd-3", name: "Social Media Templates", category: "labor", type: "unit", rate: 15000, quantity: 10, description: "Editable Canva/PS templates" },
            { id: "gd-4", name: "Creative Suite License", category: "tools", type: "subscription", rate: 45000, quantity: 1, description: "Adobe CC Licensing allocation" },
            { id: "gd-5", name: "Stock Assets", category: "material", type: "fixed", rate: 50000, quantity: 1, description: "Fonts, Photos, Icons license" },
        ]
    },
    {
        id: "writing",
        name: "Writing & Content",
        description: "Copywriting, Blogs, Social Media",
        icon: Megaphone,
        defaultItems: [
            { id: "wrt-1", name: "Blog Post (1500w)", category: "labor", type: "unit", rate: 45000, quantity: 4, description: "SEO optimized deep-dive articles" },
            { id: "wrt-2", name: "Social Media Captions", category: "labor", type: "fixed", rate: 80000, quantity: 1, description: "Monthly calendar (30 posts)" },
            { id: "wrt-3", name: "Email Sequence", category: "labor", type: "fixed", rate: 120000, quantity: 1, description: "5-part welcome series" },
            { id: "wrt-4", name: "SEO Tool Access", category: "tools", type: "subscription", rate: 25000, quantity: 1, description: "SEMrush/Ahrefs tool usage" },
            { id: "wrt-5", name: "Plagiarism Check", category: "overhead", type: "fixed", rate: 5000, quantity: 1, description: "Copyscape credits" },
        ]
    },
    {
        id: "photography",
        name: "Photography",
        description: "Events, Portraits, Product Shoots",
        icon: Camera,
        defaultItems: [
            { id: "ph-1", name: "Shooting Session (Half Day)", category: "labor", type: "hourly", rate: 45000, quantity: 4, description: "On-location professional shooting" },
            { id: "ph-2", name: "High-End Retouching", category: "labor", type: "hourly", rate: 25000, quantity: 6, description: "Color grade, skin retouching" },
            { id: "ph-3", name: "Gear & Lighting Rental", category: "tools", type: "fixed", rate: 75000, quantity: 1, description: "Professional lighting/lens kit" },
            { id: "ph-4", name: "Logistics & Transport", category: "overhead", type: "fixed", rate: 30000, quantity: 1, description: "Location scouting and travel" },
            { id: "ph-5", name: "Studio Fee", category: "overhead", type: "fixed", rate: 120000, quantity: 1, description: "Studio space booking", isOptional: true, isSelected: false },
        ]
    },
    {
        id: "baking",
        name: "Baking / Small Biz",
        description: "Cakes, Pastries, Custom Orders",
        icon: Utensils,
        defaultItems: [
            { id: "bk-1", name: "Ingredients (Bulk)", category: "material", type: "fixed", rate: 45000, quantity: 1, description: "Flour, Sugar, Butter, Eggs" },
            { id: "bk-2", name: "Specialty Toppings", category: "material", type: "fixed", rate: 25000, quantity: 1, description: "Edible gold, Fondant, Flowers" },
            { id: "bk-3", name: "Baking Labor", category: "labor", type: "hourly", rate: 8000, quantity: 6, description: "Mixing, Baking, Decorating" },
            { id: "bk-4", name: "Packaging", category: "material", type: "unit", rate: 1500, quantity: 10, description: "Boxes, Boards, Ribbons" },
            { id: "bk-5", name: "Delivery", category: "overhead", type: "fixed", rate: 5000, quantity: 1, description: "Local delivery fee" },
        ]
    },
    {
        id: "catering",
        name: "Catering",
        description: "Weddings, Corporate Events, Parties",
        icon: Utensils,
        defaultItems: [
            { id: "cat-1", name: "Premium Ingredients", category: "material", type: "fixed", rate: 450000, quantity: 1, description: "Sourced match for 50 guests" },
            { id: "cat-2", name: "Head Chef", category: "labor", type: "hourly", rate: 35000, quantity: 8, description: "Menu prep and execution" },
            { id: "cat-3", name: "Service Staff", category: "labor", type: "hourly", rate: 10000, quantity: 16, description: "2 servers for 8 hours" },
            { id: "cat-4", name: "Kitchen Equipment", category: "tools", type: "fixed", rate: 150000, quantity: 1, description: "Portable ovens/warmers" },
            { id: "cat-5", name: "Logistics & Setup", category: "overhead", type: "fixed", rate: 50000, quantity: 1, description: "Transport and buffer setup" },
        ]
    },
    {
        id: "fashion",
        name: "Tailoring & Fashion",
        description: "Custom wear, Alterations, Design",
        icon: Scissors,
        defaultItems: [
            { id: "fas-1", name: "Premium Fabric", category: "material", type: "unit", rate: 15000, quantity: 4, description: "High-grade wool/linen per yard" },
            { id: "fas-2", name: "Design & Sewing", category: "labor", type: "hourly", rate: 12000, quantity: 20, description: "Pattern drafting and construction" },
            { id: "fas-3", name: "Trims & Haberdashery", category: "material", type: "fixed", rate: 25000, quantity: 1, description: "Premium buttons, lining, zipper" },
            { id: "fas-4", name: "Consultation & Fittings", category: "labor", type: "fixed", rate: 30000, quantity: 1, description: "3 sessions included" },
            { id: "fas-5", name: "Express Service", category: "addons", type: "fixed", rate: 40000, quantity: 1, description: "Rush order fee", isOptional: true, isSelected: false },
        ]
    },
    {
        id: "plumbing",
        name: "Plumbing/Trades",
        description: "Repairs, Installations, Maintenance",
        icon: Wrench,
        defaultItems: [
            { id: "pl-1", name: "Call-out Fee", category: "overhead", type: "fixed", rate: 25000, quantity: 1, description: "Diagnostic visit" },
            { id: "pl-2", name: "Expert Labor", category: "labor", type: "hourly", rate: 20000, quantity: 3, description: "Skilled repair work" },
            { id: "pl-3", name: "Materials", category: "material", type: "fixed", rate: 85000, quantity: 1, description: "Replacement parts/piping" },
            { id: "pl-4", name: "Tool Wear & Tear", category: "tools", type: "fixed", rate: 5000, quantity: 1, description: "Equipment usage fee" },
        ]
    },
    {
        id: "events",
        name: "Event Planning",
        description: "Coordination, Logistics, Decor",
        icon: Calendar,
        defaultItems: [
            { id: "evt-1", name: "Agency Fee", category: "labor", type: "fixed", rate: 500000, quantity: 1, description: "Full service planning" },
            { id: "evt-2", name: "Decor & Production", category: "material", type: "fixed", rate: 800000, quantity: 1, description: "Stage, lights, florals" },
            { id: "evt-3", name: "Day-of Coordinator", category: "labor", type: "hourly", rate: 35000, quantity: 12, description: "Dedicated manager on site" },
            { id: "evt-4", name: "Venue Booking", category: "overhead", type: "fixed", rate: 1500000, quantity: 1, description: "Hall rental deposit", isOptional: true, isSelected: false },
        ]
    },
    {
        id: "custom",
        name: "Custom Project",
        description: "Start from scratch (Empty)",
        icon: Code, // Fallback icon
        defaultItems: [
            { id: "cst-1", name: "Labor Hours", category: "labor", type: "hourly", rate: 10000, quantity: 1, description: "Basic labor rate" },
        ]
    }
];
