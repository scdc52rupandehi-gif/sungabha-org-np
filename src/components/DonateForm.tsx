"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createDonation } from "@/app/actions/donations";
import { UploadCloud, CheckCircle2, Building2, QrCode } from 'lucide-react';
import Image from "next/image";

const PURPOSES = [
  "General",
  "Education",
  "Health",
  "Women Empowerment",
  "Disaster Relief",
  "Child Welfare",
  "Environment",
  "Other"
];

export default function DonateForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    amount: '',
    purpose: 'General',
    message: ''
  });

  const [screenshot, setScreenshot] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.email || !formData.amount) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) {
      toast.error("Please upload a screenshot of your payment.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append('screenshot', screenshot);

    try {
      const result = await createDonation(data);
      if (result && !result.success) {
        toast.error(result.error || "Failed to submit donation.");
      } else {
        setIsSubmitted(true);
        toast.success("Thank you! Your donation details have been submitted.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Donation Received!</h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8">
          Thank you for your generous contribution, {formData.first_name}! Your payment is under review, and we have sent an acknowledgment email to <strong>{formData.email}</strong>.
        </p>
        <Button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Make Another Donation
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-3xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center mb-10">
        <div className={`flex items-center ${step >= 1 ? 'text-emerald-600' : 'text-zinc-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mr-2">1</div>
          <span className="font-medium">Details</span>
        </div>
        <div className="w-16 h-1 bg-zinc-200 dark:bg-zinc-800 mx-4 rounded">
          <div className={`h-full bg-emerald-600 rounded ${step >= 2 ? 'w-full' : 'w-0'} transition-all duration-300`} />
        </div>
        <div className={`flex items-center ${step >= 2 ? 'text-emerald-600' : 'text-zinc-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mr-2">2</div>
          <span className="font-medium">Payment</span>
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={nextStep} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">First Name <span className="text-red-500">*</span></label>
              <Input name="first_name" value={formData.first_name} onChange={handleInputChange} required placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Last Name</label>
              <Input name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email <span className="text-red-500">*</span></label>
              <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone Number</label>
              <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+977..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Donation Amount <span className="text-red-500">*</span></label>
              <Input name="amount" value={formData.amount} onChange={handleInputChange} required placeholder="e.g. Rs. 5000 or $50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Donation Purpose <span className="text-red-500">*</span></label>
              <select 
                name="purpose" 
                value={formData.purpose} 
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {PURPOSES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message (Optional)</label>
            <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Any message you'd like to share with us..." rows={4} />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
              Next: Payment Details
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-6 border border-emerald-100 dark:border-emerald-900/20 mb-8">
            <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-400 mb-6 text-center">Scan to Pay OR Bank Transfer</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 h-full min-h-[250px]">
                {/* Generic QR placeholder for demo */}
                <div className="w-48 h-48 bg-zinc-100 dark:bg-zinc-700 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex flex-col items-center justify-center mb-4 text-zinc-400">
                  <QrCode className="w-12 h-12 mb-2" />
                  <span className="text-sm font-medium">QR Code</span>
                </div>
                <p className="text-sm font-medium text-zinc-500 text-center">Scan to Pay</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <p className="text-sm text-zinc-500">Bank Name</p>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">SHINE RESUNGA DEVELOPMENT BANK LTD.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <p className="text-sm text-zinc-500">Branch</p>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">RUDRAPUR BRANCH</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <p className="text-sm text-zinc-500">Account Name</p>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">SUNGABHA COMMUNITY DEVELOPMENT CENTER</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <p className="text-sm text-zinc-500">Account Number</p>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono tracking-wider">00500600024364000005</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <p className="text-sm text-zinc-500">Account Type</p>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">S.R. SAVING NPR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block text-center">
              Upload Payment Screenshot <span className="text-red-500">*</span>
            </label>
            <div className="flex justify-center">
              <div className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors w-full max-w-md text-center">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <UploadCloud className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {screenshot ? screenshot.name : "Click or drag to upload"}
                </p>
                <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={loading}>
              Back
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8" disabled={loading}>
              {loading ? "Processing..." : "Complete Donation"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
