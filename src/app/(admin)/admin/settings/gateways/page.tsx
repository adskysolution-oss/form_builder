"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const GATEWAYS = ['RAZORPAY', 'CASHFREE', 'PAYU', 'PHONEPE', 'PAYTM'] as const;

export default function AdminGatewaySettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings/gateway")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          const map: any = {};
          data.settings.forEach((s: any) => {
            map[s.gateway] = s;
          });
          setSettings(map);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (gateway: string) => {
    const current = settings[gateway] || { isActive: false, credentials: { keyId: "", keySecret: "" }, commissionPercent: 0 };
    
    try {
      const res = await fetch("/api/settings/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway,
          isActive: current.isActive,
          credentials: current.credentials,
          commissionPercent: Number(current.commissionPercent) || 0
        })
      });

      if (res.ok) {
        alert(`Admin ${gateway} settings saved successfully!`);
      } else {
        alert(`Failed to save ${gateway} settings.`);
      }
    } catch (err) {
      alert("An error occurred while saving.");
    }
  };

  const updateSetting = (gateway: string, field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        [field]: value
      }
    }));
  };

  const updateCredential = (gateway: string, key: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        credentials: {
          ...(prev[gateway]?.credentials || {}),
          [key]: value
        }
      }
    }));
  };

  if (loading) return <div className="p-8">Loading admin settings...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Platform Payment Gateways</h2>
        <p className="text-muted-foreground">Configure global API keys for user subscriptions and set platform commission.</p>
      </div>

      <div className="grid gap-6">
        {GATEWAYS.map(gateway => {
          const current = settings[gateway] || { isActive: false, credentials: { keyId: "", keySecret: "" }, commissionPercent: 0 };
          return (
            <Card key={gateway}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{gateway}</CardTitle>
                  <CardDescription>Enable {gateway} for subscriptions.</CardDescription>
                </div>
                <Switch 
                  checked={current.isActive} 
                  onCheckedChange={(c) => updateSetting(gateway, "isActive", c)} 
                />
              </CardHeader>
              <CardContent className="space-y-4">
                {current.isActive && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>API Key ID / Merchant ID</Label>
                        <Input 
                          value={current.credentials?.keyId || ""} 
                          onChange={(e) => updateCredential(gateway, "keyId", e.target.value)}
                          placeholder="Enter Key ID" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>API Key Secret / Salt</Label>
                        <Input 
                          type="password"
                          value={current.credentials?.keySecret || ""} 
                          onChange={(e) => updateCredential(gateway, "keySecret", e.target.value)}
                          placeholder="Enter Key Secret" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2 border-t pt-4 mt-4">
                      <Label>Platform Commission (%)</Label>
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        value={current.commissionPercent || 0} 
                        onChange={(e) => updateSetting(gateway, "commissionPercent", e.target.value)}
                        placeholder="e.g. 2 for 2%" 
                      />
                      <p className="text-xs text-muted-foreground">Commission taken from user form payments if they use the platform's default keys.</p>
                    </div>
                  </>
                )}
              </CardContent>
              {current.isActive && (
                <CardFooter>
                  <Button onClick={() => handleSave(gateway)}>Save {gateway} Settings</Button>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
