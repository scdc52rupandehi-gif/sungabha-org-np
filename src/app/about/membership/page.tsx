"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Award, CheckCircle } from 'lucide-react';

export default function MembershipPage() {
  const membershipTypes = [
    {
      title: "General Member",
      icon: <Users className="w-8 h-8 text-brand-blue" />,
      description: "For each general member, the membership shall be effective from 1st of Shrawan each year and ends by the end of Ashadh of the following year. Each general member should renew his or her membership from the 1st to the end of Shrawan. If the membership is not renewed within three years, the membership expires.",
      color: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-brand-blue/20"
    },
    {
      title: "Life Member",
      icon: <Star className="w-8 h-8 text-brand-orange" />,
      description: "Dedicated individuals who pledge lifelong commitment to the values and objectives of Sungabha Community Development Centre.",
      color: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-brand-orange/20"
    },
    {
      title: "Honorable Member",
      icon: <Award className="w-8 h-8 text-brand-green" />,
      description: "Those local and expatriate who contribute remarkably to this organization can become honorable members.",
      color: "bg-green-50 dark:bg-green-900/20",
      border: "border-brand-green/20"
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-4 block">
            Join Our Organization
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-6 font-heading">
            Membership Information
          </h1>
          <div className="w-24 h-1.5 bg-brand-blue mx-auto rounded-full mb-8" />
          
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 text-left">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <CheckCircle className="text-brand-green w-6 h-6" />
              Eligibility
            </h3>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Nepalese citizens older than 18 years are eligible to become a member of this organization, if they internalize its objectives, which are aimed at building this nation, and if they are willing to devote themselves continuously for the country's well being.
            </p>
          </div>
        </motion.div>

        {/* Membership Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 font-heading text-center">
            Types of Membership
          </h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-10">
            Sungabha Community Development Centre (SCDC) has several types of membership:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {membershipTypes.map((type, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-3xl ${type.color} border ${type.border} transition-all`}
              >
                <div className="bg-white dark:bg-zinc-800 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  {type.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {type.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
