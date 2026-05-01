"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function PublicFormRenderer({ form }: { form: any }) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const hasPayment = form.fields.some((f: any) => f.type === 'PAYMENT');

  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePayment = async () => {
    // This is a simplified Razorpay integration simulation
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: form._id,
          amount: 100, // Assuming static amount for demo. Ideally this comes from the form config.
          gateway: "RAZORPAY", // Assuming razorpay for demo
          email: formData["email"] || "test@test.com",
          name: formData["name"] || "Test User",
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      const data = await res.json();
      
      // Load Razorpay script if not loaded
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
        amount: 100 * 100,
        currency: "INR",
        name: form.title,
        description: "Form Submission Payment",
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await fetch("/api/payments/verify", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               orderId: data.orderId,
               paymentId: response.razorpay_payment_id,
               signature: response.razorpay_signature,
               gateway: "RAZORPAY"
             })
          });

          if (verifyRes.ok) {
             submitForm();
          } else {
             setPaymentError("Payment verification failed.");
          }
        },
        theme: {
          color: form.settings.themeColor || "#3b82f6"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setPaymentError(err.message || "Payment initiation failed");
      setIsSubmitting(false);
    }
  };

  const submitForm = async () => {
    try {
      const res = await fetch(`/api/submissions/${form._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Submission failed");
      }
    } catch (err) {
      alert("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPaymentError("");

    if (hasPayment) {
      await handlePayment();
    } else {
      await submitForm();
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Success!</h2>
        <p className="text-muted-foreground">{form.settings.successMessage || "Thank you! Your response has been recorded."}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {paymentError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm">
          {paymentError}
        </div>
      )}

      {form.fields.map((field: any) => (
        <Card key={field.id} className="shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {field.type === 'TEXT' && (
                <Input 
                  placeholder={field.placeholder || "Your answer"} 
                  required={field.required} 
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}
              {field.type === 'EMAIL' && (
                <Input 
                  type="email" 
                  placeholder={field.placeholder || "Your email"} 
                  required={field.required}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}
              {field.type === 'PHONE' && (
                <Input 
                  type="tel" 
                  placeholder={field.placeholder || "Your phone number"} 
                  required={field.required}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}
              {field.type === 'PAYMENT' && (
                <div className="p-4 border rounded-md bg-muted/20 text-center">
                  <p className="font-medium">Secure Payment Required</p>
                  <p className="text-sm text-muted-foreground">You will be redirected to the payment gateway after clicking submit.</p>
                </div>
              )}
              {/* Complex fields placeholders */}
              {['DROPDOWN', 'CHECKBOX', 'FILE'].includes(field.type) && (
                <div className="text-sm text-muted-foreground italic border border-dashed p-4 rounded bg-muted/20">
                  [{field.type}] input simulation
                  <Input onChange={(e) => handleChange(field.id, e.target.value)} placeholder="Type here for demo..." />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="flex justify-between items-center pt-4">
        <Button 
          size="lg" 
          type="submit" 
          disabled={isSubmitting}
          style={{ backgroundColor: form.settings.themeColor || '#3b82f6' }}
        >
          {isSubmitting ? "Processing..." : form.settings.submitText || "Submit"}
        </Button>
        <div className="text-xs text-muted-foreground">
          Powered by <span className="font-bold">SmartForm</span>
        </div>
      </div>
    </form>
  );
}
