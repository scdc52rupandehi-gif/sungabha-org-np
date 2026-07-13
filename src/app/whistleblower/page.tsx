"use client";

import React, { useState } from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createWhistleblowerMessage } from "@/app/actions/whistleblower";
import { ShieldAlert, Info, CheckCircle2 } from 'lucide-react';

export default function WhistleblowerPage() {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createWhistleblowerMessage(formData);
      toast.success("Thank you. Your report has been submitted securely.");
      setIsSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero 
        title="WHISTLEBLOWER" 
        subtitle="Safely and anonymously report suspicions of corruption, abuse, or unethical behavior."
        backgroundImage="/Image/476814918_920127853644624_64978360843978164_n.jpg"
      />
      <Section className="py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Info Box */}
          <div className="bg-card border-l-4 border-l-destructive shadow-lg rounded-r-2xl p-8 relative overflow-hidden">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-destructive" />
              </div>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  SCDC has <strong className="text-foreground">zero tolerance</strong> for issues related to corruption, abuse, and violence. You can safely and anonymously report suspicions of corruption, bribery, money laundering, unethical behavior or other matters you have experienced or seen yourself.
                </p>
                <p>
                  You can directly send your complaints to: <a href="mailto:director@sungabha.org.np" className="text-brand-blue font-semibold hover:underline">director@sungabha.org.np</a>
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-card border border-border shadow-xl rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldAlert className="w-64 h-64 text-destructive" />
            </div>
            
            <div className="relative z-10">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-brand-green" />
                  </div>
                  <h2 className="text-4xl font-heading font-bold text-foreground">Report Submitted Successfully</h2>
                  <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                    Thank you for stepping forward. Your report has been securely transmitted. SCDC takes all reports seriously and will carefully review the information provided.
                  </p>
                  <div className="pt-8">
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-6 text-lg rounded-xl font-bold transition-all"
                    >
                      Submit Another Report
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-8">Send Your Message Directly!</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Name (optional)</label>
                      <Input 
                        name="name" 
                        placeholder="Enter your name (leave blank for anonymous)" 
                        className="h-12 bg-muted/50 border-border/50 focus:border-brand-blue transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Email (optional)</label>
                      <Input 
                        name="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        className="h-12 bg-muted/50 border-border/50 focus:border-brand-blue transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Phone (optional)</label>
                      <Input 
                        name="phone" 
                        type="tel" 
                        placeholder="Enter your phone number" 
                        className="h-12 bg-muted/50 border-border/50 focus:border-brand-blue transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Message <span className="text-destructive">*</span> (required)</label>
                      <textarea 
                        name="message" 
                        required 
                        rows={6}
                        className="w-full flex rounded-xl border border-border/50 bg-muted/50 px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue focus-visible:border-brand-blue disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe your concern in detail..."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-14 text-lg font-bold bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl shadow-lg transition-all active:scale-95" 
                      disabled={loading}
                    >
                      {loading ? "SUBMITTING..." : "SUBMIT"}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
