import connectDB from "@/lib/db";
import { Plan } from "@/models/Plan";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default async function PricingPage() {
  await connectDB();
  const plans = await Plan.find().sort({ price: 1 });

  // If no plans exist, show placeholder ones
  const displayPlans = plans.length > 0 ? plans : [
    {
      _id: "free_tier",
      name: "Free",
      price: 0,
      features: { maxForms: 3, maxResponses: 100, customDomain: false, removeBranding: false }
    },
    {
      _id: "pro_tier",
      name: "Pro",
      price: 499,
      features: { maxForms: 100, maxResponses: 10000, customDomain: true, removeBranding: true }
    }
  ];

  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground">Choose the plan that's right for your business.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {displayPlans.map((plan: any) => (
          <Card key={plan._id} className={plan.name === 'Pro' ? 'border-primary shadow-lg scale-105' : ''}>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                ₹{plan.price}
                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>Up to <strong>{plan.features.maxForms}</strong> forms</span>
                </li>
                <li className="flex gap-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>Up to <strong>{plan.features.maxResponses}</strong> responses/mo</span>
                </li>
                <li className="flex gap-x-3">
                  <Check className={plan.features.customDomain ? "text-primary h-5 w-5 flex-shrink-0" : "text-muted-foreground opacity-50 h-5 w-5 flex-shrink-0"} />
                  <span className={plan.features.customDomain ? "" : "text-muted-foreground line-through"}>Custom Domain</span>
                </li>
                <li className="flex gap-x-3">
                  <Check className={plan.features.removeBranding ? "text-primary h-5 w-5 flex-shrink-0" : "text-muted-foreground opacity-50 h-5 w-5 flex-shrink-0"} />
                  <span className={plan.features.removeBranding ? "" : "text-muted-foreground line-through"}>Remove SmartForm Branding</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.name === 'Pro' ? 'default' : 'outline'}
                asChild
              >
                <a href={plan.price === 0 ? "/register" : `/checkout/${plan._id}`}>
                  {plan.price === 0 ? 'Get Started for Free' : 'Subscribe Now'}
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
