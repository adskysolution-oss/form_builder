"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutPage({ params }: { params: { planId: string } }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (gateway: string) => {
    setLoading(true);
    setError("");

    try {
      // In a real app, we'd pass the Admin's ID or hardcode an "ADMIN" query to fetch the admin's keys
      // and we'd fetch the actual plan price. For demo, simulating a Rs 499 payment.
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: "subscription_payment", // mock ID for subscription
          amount: 499,
          gateway,
          email: "user@example.com",
          name: "User Name",
        })
      });

      if (!res.ok) {
         throw new Error("Payment initialization failed (Check if Admin Gateway is configured)");
      }

      const data = await res.json();
      
      if (gateway === "RAZORPAY") {
        if (!(window as any).Razorpay) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            document.body.appendChild(script);
          });
        }

        const options = {
          key: data.keyId,
          amount: 499 * 100,
          currency: "INR",
          name: "SmartForm Pro Subscription",
          description: "Monthly Plan",
          order_id: data.orderId,
          handler: function (response: any) {
             alert("Subscription successful! Transaction ID: " + response.razorpay_payment_id);
             window.location.href = "/dashboard";
          },
          theme: { color: "#000000" }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
         alert(`Simulated checkout for ${gateway}. Transaction ID: ${data.orderId}`);
         window.location.href = "/dashboard";
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Subscription</CardTitle>
          <CardDescription>Plan ID: {params.planId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-background p-4 rounded-lg border flex justify-between items-center mb-6">
            <span className="font-medium">Total Amount Due:</span>
            <span className="text-2xl font-bold">₹499</span>
          </div>
          
          {error && <div className="text-sm text-red-500 text-center">{error}</div>}

          <div className="space-y-3">
            <Button className="w-full" onClick={() => handleCheckout("RAZORPAY")} disabled={loading}>
              Pay via Razorpay
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleCheckout("CASHFREE")} disabled={loading}>
              Pay via Cashfree
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleCheckout("PAYU")} disabled={loading}>
              Pay via PayU
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleCheckout("PHONEPE")} disabled={loading}>
              Pay via PhonePe
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleCheckout("PAYTM")} disabled={loading}>
              Pay via Paytm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
