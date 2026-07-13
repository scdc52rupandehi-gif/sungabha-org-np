"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createMessage } from "@/app/actions/messages";
import { CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createMessage(formData);
      setIsSubmitted(true);
      toast.success("Thank you! Your message has been sent.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative pt-40 pb-16 min-h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-20 dark:opacity-30 bg-cover bg-center bg-no-repeat bg-fixed mix-blend-luminosity"
        style={{ backgroundImage: 'url("/Image/Contact Banner.png")' }}
      />
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-50/90 via-zinc-50/60 to-zinc-50/95 dark:from-zinc-950/90 dark:via-zinc-950/60 dark:to-zinc-950/95 pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
              We'd love to hear from you. Please fill out the form and our team will get back to you shortly.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-zinc-700 dark:text-zinc-300">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600">
                  📍
                </div>
                <div>
                  <h4 className="font-semibold">Head Office</h4>
                  <p className="text-sm">Sainamaina Municipality-3, Murgiya, Rupandehi, Nepal</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-zinc-700 dark:text-zinc-300">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center text-sky-600">
                  ✉️
                </div>
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-sm">scdc52rupandehi@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-lg border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Message Sent Successfully!</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Thank you for reaching out to us. Our team will review your message and get back to you shortly.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)} 
                  variant="outline" 
                  className="mt-4 border-zinc-200 dark:border-zinc-800"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input name="first_name" required placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input name="last_name" required placeholder="Doe" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input name="email" type="email" required placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mobile Number</label>
                      <Input name="phone" type="tel" placeholder="+977 9800000000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input name="subject" required placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea 
                      name="message" 
                      required 
                      rows={4}
                      className="w-full flex rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                      placeholder="Type your message here..."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
