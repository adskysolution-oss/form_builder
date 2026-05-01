"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, Sparkles, Send, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TypeformRenderer({ form }: { form: any }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fields = form.fields || [];
  const progress = ((currentStep + 1) / fields.length) * 100;

  const handleNext = () => {
    if (currentStep < fields.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/submissions/${form._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="bg-white p-12 rounded-[40px] shadow-2xl shadow-blue-500/10 border border-slate-100">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Thank You!</h2>
            <p className="text-slate-500 font-medium">Your response has been securely captured by SmartForm.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentField = fields[currentStep];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Progress value={progress} className="h-1.5 rounded-none bg-slate-50" />
      </div>

      <main className="flex-1 flex items-center justify-center p-6 md:p-24 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl w-full space-y-12"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-600 font-bold tracking-widest text-xs uppercase">
                <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-600 text-[10px]">
                  {currentStep + 1}
                </span>
                Question {currentStep + 1} of {fields.length}
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {currentField.label}
              </h2>
            </div>

            <div className="space-y-8">
              {currentField.type === 'text' || currentField.type === 'email' || currentField.type === 'number' ? (
                <div className="relative group">
                  <Input
                    autoFocus
                    type={currentField.type}
                    value={formData[currentField.id] || ""}
                    onChange={(e) => setFormData({ ...formData, [currentField.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    className="text-2xl md:text-3xl h-auto py-4 border-0 border-b-2 border-slate-100 rounded-none focus-visible:ring-0 focus-visible:border-blue-600 bg-transparent px-0 transition-all placeholder:text-slate-200"
                    placeholder="Type your answer here..."
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 w-0 group-focus-within:w-full transition-all duration-500" />
                </div>
              ) : currentField.type === 'payment' ? (
                <Card className="p-8 border-2 border-blue-500 bg-blue-50/30 rounded-3xl">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                       <CreditCard className="h-6 w-6 text-white" />
                     </div>
                     <div>
                       <h3 className="font-bold text-xl text-slate-900">Secure Checkout</h3>
                       <p className="text-sm text-slate-500">Pay securely to complete this form</p>
                     </div>
                   </div>
                   <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                     Proceed to Payment
                   </Button>
                </Card>
              ) : null}

              <div className="flex items-center gap-4 pt-8">
                <Button 
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 group"
                >
                  {currentStep === fields.length - 1 ? (
                    <><Send className="mr-2 h-5 w-5" /> Submit Form</>
                  ) : (
                    <><ChevronRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /> OK</>
                  )}
                </Button>
                <div className="text-xs text-slate-400 font-medium">
                  Press <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-bold text-slate-600">Enter ↵</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="p-8 flex justify-between items-center text-slate-300">
        <div className="flex gap-2">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={handlePrev} 
             disabled={currentStep === 0}
             className="rounded-xl border border-slate-100 hover:bg-slate-50"
           >
             <ChevronLeft className="h-5 w-5" />
           </Button>
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={handleNext} 
             disabled={currentStep === fields.length - 1}
             className="rounded-xl border border-slate-100 hover:bg-slate-50"
           >
             <ChevronRight className="h-5 w-5" />
           </Button>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-400 opacity-50">
          Powered by <Sparkles className="h-4 w-4 text-blue-500" /> <span className="text-slate-900">SmartForm</span>
        </div>
      </footer>
    </div>
  );
}
