"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { createVolunteer } from '@/app/actions/volunteers';
import { toast } from 'sonner';
import { Check, ChevronRight, ChevronLeft, Upload, Loader2, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB

const volunteerSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  gender: z.string().min(1, 'Gender is required'),
  dob: z.string().min(1, 'Date of Birth is required'),
  citizenship_number: z.string().optional(),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email is required'),
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  municipality: z.string().min(1, 'Municipality is required'),
  ward: z.string().min(1, 'Ward is required'),
  address: z.string().min(1, 'Full Address is required'),
  emergency_contact_name: z.string().min(1, 'Emergency Contact Name required'),
  emergency_relationship: z.string().min(1, 'Relationship required'),
  emergency_phone: z.string().min(10, 'Valid phone required'),
  blood_group: z.string().optional(),
  education_level: z.string().min(1, 'Education level required'),
  occupation: z.string().optional(),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  previous_experience: z.any().transform(val => val === 'true' || val === true),
  previous_organization: z.string().optional(),
  volunteer_duration: z.string().optional(),
  previous_role: z.string().optional(),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  available_days: z.array(z.string()).min(1, 'Select at least one available day'),
  available_time: z.array(z.string()).min(1, 'Select available time'),
  motivation: z.string().min(10, 'Please tell us why you want to join'),
  medical_conditions: z.string().optional(),
  declaration: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

const STEPS = [
  { id: 0, title: 'Personal Info' },
  { id: 1, title: 'Address & Contact' },
  { id: 2, title: 'Background' },
  { id: 3, title: 'Skills & Interests' },
  { id: 4, title: 'Documents' },
];

export default function VolunteerForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema) as any,
    defaultValues: {
      previous_experience: false,
      languages: [],
      skills: [],
      interests: [],
      available_days: [],
      available_time: [],
      declaration: false,
    }
  });

  const uploadFile = async (file: File, folder: string) => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('volunteer-documents')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('volunteer-documents')
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  const onSubmit = async (values: VolunteerFormValues) => {
    setIsSubmitting(true);
    try {
      let photo_url = null;
      let cv_url = null;

      if (photoFile) photo_url = await uploadFile(photoFile, 'photos');
      if (cvFile) cv_url = await uploadFile(cvFile, 'cvs');

      const payload = {
        ...values,
        photo_url,
        cv_url,
      };
      
      // Remove local-only states
      delete (payload as any).declaration;

      const result = await createVolunteer(payload);
      setSuccessData(result);
      toast.success("Application Submitted Successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ['full_name', 'gender', 'dob'];
    if (currentStep === 1) fieldsToValidate = ['email', 'phone', 'province', 'district', 'municipality', 'ward', 'address', 'emergency_contact_name', 'emergency_relationship', 'emergency_phone'];
    if (currentStep === 2) fieldsToValidate = ['education_level', 'languages'];
    if (currentStep === 3) fieldsToValidate = ['skills', 'interests', 'available_days', 'available_time', 'motivation'];
    
    const isStepValid = await form.trigger(fieldsToValidate as any);
    if (isStepValid) setCurrentStep(prev => prev + 1);
  };

  const onError = (errors: any) => {
    console.error("Form Validation Errors:", errors);
    toast.error("Please check all steps. Some required fields are missing or invalid.");
  };

  const handleCheckboxArray = (field: keyof VolunteerFormValues, value: string) => {
    const currentValues = form.getValues(field) as string[];
    if (currentValues.includes(value)) {
      form.setValue(field as any, currentValues.filter(v => v !== value));
    } else {
      form.setValue(field as any, [...currentValues, value]);
    }
    form.trigger(field as any);
  };

  if (successData) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="w-12 h-12 text-emerald-600 dark:text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 font-heading uppercase">Application Submitted</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">Thank you for your interest! Your volunteer application has been successfully received.</p>
        
        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl mb-8 border border-zinc-100 dark:border-zinc-800">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Reference Number</p>
          <p className="text-3xl font-mono font-bold text-brand-blue">{successData.reference_id}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer size={18} /> Print Application
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue/90 gap-2" onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 max-w-4xl mx-auto overflow-hidden">
      {/* Progress Header */}
      <div className="bg-zinc-50 dark:bg-zinc-950 p-6 md:px-12 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full -z-10"></div>
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center gap-2 z-10 bg-zinc-50 dark:bg-zinc-950 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                index <= currentStep 
                  ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' 
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {index < currentStep ? <Check size={18} /> : index + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${index <= currentStep ? 'text-brand-blue' : 'text-zinc-500'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-12">
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* STEP 0: Personal Info */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold font-heading mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Full Name *</label>
                      <Input {...form.register('full_name')} placeholder="e.g. Ramesh Thapa" />
                      {form.formState.errors.full_name && <p className="text-red-500 text-xs">{form.formState.errors.full_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Gender *</label>
                      <select {...form.register('gender')} className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {form.formState.errors.gender && <p className="text-red-500 text-xs">{form.formState.errors.gender.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Date of Birth *</label>
                      <Input type="date" {...form.register('dob')} />
                      {form.formState.errors.dob && <p className="text-red-500 text-xs">{form.formState.errors.dob.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Blood Group</label>
                      <select {...form.register('blood_group')} className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                        <option value="">Select</option>
                        <option value="A+">A+</option><option value="A-">A-</option>
                        <option value="B+">B+</option><option value="B-">B-</option>
                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        <option value="O+">O+</option><option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Citizenship Number (Optional)</label>
                      <Input {...form.register('citizenship_number')} placeholder="Citizenship No." />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: Address & Contact */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold font-heading mb-6">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Email Address *</label>
                        <Input type="email" {...form.register('email')} placeholder="email@example.com" />
                        {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Mobile Number *</label>
                        <Input type="tel" {...form.register('phone')} placeholder="+977 9800000000" />
                        {form.formState.errors.phone && <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Province *</label>
                        <select {...form.register('province')} className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                          <option value="">Select Province</option>
                          <option value="Koshi">Koshi</option>
                          <option value="Madhesh">Madhesh</option>
                          <option value="Bagmati">Bagmati</option>
                          <option value="Gandaki">Gandaki</option>
                          <option value="Lumbini">Lumbini</option>
                          <option value="Karnali">Karnali</option>
                          <option value="Sudurpashchim">Sudurpashchim</option>
                        </select>
                        {form.formState.errors.province && <p className="text-red-500 text-xs">{form.formState.errors.province.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">District *</label>
                        <Input {...form.register('district')} placeholder="e.g. Rupandehi" />
                        {form.formState.errors.district && <p className="text-red-500 text-xs">{form.formState.errors.district.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Municipality / Rural Municipality *</label>
                        <Input {...form.register('municipality')} placeholder="e.g. Butwal" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Ward No. *</label>
                        <Input {...form.register('ward')} placeholder="e.g. 11" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold">Full Address *</label>
                        <Input {...form.register('address')} placeholder="Street, Tole, Landmark" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-xl font-bold font-heading mb-6">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Name *</label>
                        <Input {...form.register('emergency_contact_name')} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Relationship *</label>
                        <Input {...form.register('emergency_relationship')} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Phone *</label>
                        <Input {...form.register('emergency_phone')} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Background */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold font-heading mb-6">Education & Occupation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Highest Education Level *</label>
                        <select {...form.register('education_level')} className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                          <option value="">Select Level</option>
                          <option value="High School">High School (10+2)</option>
                          <option value="Bachelors">Bachelor's Degree</option>
                          <option value="Masters">Master's Degree</option>
                          <option value="PhD">PhD</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Current Occupation</label>
                        <Input {...form.register('occupation')} placeholder="e.g. Student, Teacher, Engineer" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold">Languages Known *</label>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {['Nepali', 'English', 'Hindi', 'Tharu', 'Bhojpuri', 'Maithili', 'Others'].map(lang => (
                            <label key={lang} className="flex items-center gap-2 bg-accent px-4 py-2 rounded-xl cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                              <input 
                                type="checkbox" 
                                className="rounded text-brand-blue focus:ring-brand-blue" 
                                checked={form.watch('languages').includes(lang)}
                                onChange={() => handleCheckboxArray('languages', lang)}
                              />
                              <span className="text-sm">{lang}</span>
                            </label>
                          ))}
                        </div>
                        {form.formState.errors.languages && <p className="text-red-500 text-xs mt-1">{form.formState.errors.languages.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-xl font-bold font-heading mb-6">Previous Experience</h3>
                    <div className="space-y-4">
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" {...form.register('previous_experience')} value="true" className="text-brand-blue focus:ring-brand-blue" />
                          <span>Yes, I have volunteered before</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" {...form.register('previous_experience')} value="false" className="text-brand-blue focus:ring-brand-blue" />
                          <span>No, this is my first time</span>
                        </label>
                      </div>
                      
                      {String(form.watch('previous_experience')) === 'true' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold">Organization</label>
                            <Input {...form.register('previous_organization')} placeholder="Name of Org" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold">Role</label>
                            <Input {...form.register('previous_role')} placeholder="Your Role" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold">Duration</label>
                            <Input {...form.register('volunteer_duration')} placeholder="e.g. 6 Months" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Skills & Interests */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold font-heading mb-6">Skills & Interests</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-semibold mb-3 block">Your Skills (Select all that apply) *</label>
                        <div className="flex flex-wrap gap-3">
                          {['Teaching', 'Health', 'Agriculture', 'Community Mobilization', 'IT', 'Photography', 'Videography', 'Social Media', 'Environment', 'Disaster Response', 'Fundraising', 'Training', 'Administration', 'Office Support', 'Others'].map(skill => (
                            <label key={skill} className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-colors border ${form.watch('skills').includes(skill) ? 'bg-brand-blue text-white border-brand-blue' : 'bg-background border-border hover:bg-accent'}`}>
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={form.watch('skills').includes(skill)}
                                onChange={() => handleCheckboxArray('skills', skill)}
                              />
                              <span className="text-sm font-medium">{skill}</span>
                            </label>
                          ))}
                        </div>
                        {form.formState.errors.skills && <p className="text-red-500 text-xs mt-1">{form.formState.errors.skills.message}</p>}
                      </div>

                      <div>
                        <label className="text-sm font-semibold mb-3 block">Volunteer Interests (Select all that apply) *</label>
                        <div className="flex flex-wrap gap-3">
                          {['Education', 'Health', 'Women Empowerment', 'Youth Development', 'Child Rights', 'Environment', 'Agriculture', 'Livelihood', 'Emergency Response', 'Advocacy', 'Research', 'Events'].map(interest => (
                            <label key={interest} className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-colors border ${form.watch('interests').includes(interest) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-background border-border hover:bg-accent'}`}>
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={form.watch('interests').includes(interest)}
                                onChange={() => handleCheckboxArray('interests', interest)}
                              />
                              <span className="text-sm font-medium">{interest}</span>
                            </label>
                          ))}
                        </div>
                        {form.formState.errors.interests && <p className="text-red-500 text-xs mt-1">{form.formState.errors.interests.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-xl font-bold font-heading mb-6">Availability & Motivation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold mb-3 block">Available Days *</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                              <label key={day} className="flex items-center gap-2 cursor-pointer text-sm">
                                <input type="checkbox" className="rounded" onChange={() => handleCheckboxArray('available_days', day)} checked={form.watch('available_days').includes(day)} />
                                {day}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-3 block">Available Time *</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Morning', 'Afternoon', 'Evening', 'Any Time'].map(time => (
                              <label key={time} className="flex items-center gap-2 cursor-pointer text-sm">
                                <input type="checkbox" className="rounded" onChange={() => handleCheckboxArray('available_time', time)} checked={form.watch('available_time').includes(time)} />
                                {time}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold block">Why do you want to become a volunteer? *</label>
                        <Textarea {...form.register('motivation')} className="h-32 resize-none" placeholder="Tell us about your motivation..." />
                        {form.formState.errors.motivation && <p className="text-red-500 text-xs">{form.formState.errors.motivation.message}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Documents & Submit */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold font-heading mb-6">Documents & Final Step</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Photo Upload */}
                    <div className="border-2 border-dashed border-border rounded-3xl p-8 text-center hover:bg-accent/50 transition-colors">
                      <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-brand-blue" />
                      </div>
                      <h4 className="font-bold mb-2">Upload Photo (Optional)</h4>
                      <p className="text-xs text-muted-foreground mb-4">Allowed: JPG, PNG, WEBP (Max 2MB)</p>
                      <input 
                        type="file" 
                        accept=".jpg,.jpeg,.png,.webp"
                        className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-blue/90 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            if (e.target.files[0].size > MAX_PHOTO_SIZE) {
                              toast.error("Photo exceeds 2MB limit");
                              e.target.value = '';
                            } else {
                              setPhotoFile(e.target.files[0]);
                            }
                          }
                        }}
                      />
                    </div>

                    {/* CV Upload */}
                    <div className="border-2 border-dashed border-border rounded-3xl p-8 text-center hover:bg-accent/50 transition-colors">
                      <div className="w-16 h-16 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h4 className="font-bold mb-2">Upload CV (Optional)</h4>
                      <p className="text-xs text-muted-foreground mb-4">Allowed: PDF, DOC, DOCX (Max 5MB)</p>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-600/90 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            if (e.target.files[0].size > MAX_CV_SIZE) {
                              toast.error("CV exceeds 5MB limit");
                              e.target.value = '';
                            } else {
                              setCvFile(e.target.files[0]);
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input type="checkbox" {...form.register('declaration')} className="mt-1 w-5 h-5 rounded text-amber-600 focus:ring-amber-600" />
                      <div>
                        <span className="font-bold block text-zinc-900 dark:text-zinc-100">I agree to the SCDC Volunteer Policy</span>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 block">
                          I declare that all the information provided above is true to the best of my knowledge. I understand that any false information may result in the rejection of my application.
                        </span>
                        {form.formState.errors.declaration && <p className="text-red-500 text-xs mt-2">{form.formState.errors.declaration.message}</p>}
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-zinc-200 dark:border-zinc-800">
            {currentStep > 0 ? (
              <Button type="button" variant="outline" onClick={() => setCurrentStep(prev => prev - 1)} className="gap-2">
                <ChevronLeft size={16} /> Previous
              </Button>
            ) : <div></div>}
            
            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep} className="bg-brand-blue hover:bg-brand-blue/90 gap-2 px-8">
                Next <ChevronRight size={16} />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 font-bold">
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Check className="w-5 h-5" />}
                Submit Application
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
