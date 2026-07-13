"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, FileText, Download, CheckCircle, XCircle, Clock, Heart, Users, Edit3, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from "sonner";
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { updateVolunteerStatus, addVolunteerNote } from '@/app/actions/volunteers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function VolunteerDetail() {
  const { id } = useParams();
  const supabase = createClient();
  const [data, setData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Status Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Note Modal State
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [newAdminNote, setNewAdminNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const { data: vData, error: vError } = await supabase.from('volunteers').select('*').eq('id', id).single();
      if (vError) throw vError;
      setData(vData);

      const { data: tData } = await supabase.from('volunteer_timeline').select('*').eq('volunteer_id', id).order('created_at', { ascending: false });
      setTimeline(tData || []);

      const { data: nData } = await supabase.from('volunteer_notes').select('*').eq('volunteer_id', id).order('created_at', { ascending: false });
      setNotes(nData || []);

    } catch (error) {
      toast.error("Failed to fetch volunteer details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await updateVolunteerStatus(id as string, newStatus, statusNote);
      toast.success("Status updated successfully");
      setStatusModalOpen(false);
      setStatusNote("");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!newAdminNote.trim()) return;
    setIsAddingNote(true);
    try {
      await addVolunteerNote(id as string, newAdminNote);
      toast.success("Note added successfully");
      setNoteModalOpen(false);
      setNewAdminNote("");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAddingNote(false);
    }
  };

  const openStatusModal = (status: string) => {
    setNewStatus(status);
    setStatusModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading volunteer profile...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Volunteer not found.</div>;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Joined': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/volunteers">
            <Button variant="outline" size="icon" className="h-9 w-9"><ArrowLeft size={16} /></Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
              Application: {data.reference_id}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(data.status)}`}>
                {data.status}
              </span>
            </h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {data.status === 'Pending' || data.status === 'Under Review' ? (
            <>
              <Button onClick={() => openStatusModal("Interview Scheduled")} variant="outline" className="text-brand-blue border-brand-blue hover:bg-brand-blue/10">Schedule Interview</Button>
              <Button onClick={() => openStatusModal("Approved")} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"><CheckCircle size={16} /> Approve</Button>
              <Button onClick={() => openStatusModal("Rejected")} variant="destructive" className="gap-2"><XCircle size={16} /> Reject</Button>
            </>
          ) : data.status === 'Approved' ? (
            <Button onClick={() => openStatusModal("Joined")} className="bg-blue-600 hover:bg-blue-700 text-white gap-2"><Users size={16} /> Mark as Joined</Button>
          ) : (
            <Button onClick={() => openStatusModal("Under Review")} variant="outline">Change Status</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile & Contact */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-brand-blue to-brand-cyan"></div>
            <CardContent className="px-6 pb-6 pt-0 relative">
              <div className="absolute -top-16 left-6 border-4 border-card rounded-2xl overflow-hidden bg-muted w-32 h-32 flex items-center justify-center shadow-md">
                {data.photo_url ? (
                  <Image src={data.photo_url} alt={data.full_name} fill className="object-cover" />
                ) : (
                  <Users size={40} className="text-muted-foreground" />
                )}
              </div>
              <div className="mt-20">
                <h3 className="text-2xl font-bold">{data.full_name}</h3>
                <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                  <Briefcase size={14} /> {data.occupation || "Not specified"}
                </p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${data.email}`} className="text-brand-blue hover:underline">{data.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Phone</p>
                    <a href={`tel:${data.phone}`} className="text-brand-blue hover:underline">{data.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{data.address}, Ward {data.ward}</p>
                    <p className="text-muted-foreground">{data.municipality}, {data.district}, {data.province}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><Heart size={18} className="text-red-500"/> Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{data.emergency_contact_name}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Relation</span>
                <span className="font-medium">{data.emergency_relationship}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{data.emergency_phone}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><FileText size={18} className="text-emerald-600"/> Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.cv_url ? (
                <a href={data.cv_url} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full justify-between group">
                    <span className="flex items-center gap-2"><FileText size={16} className="text-emerald-600" /> Resume / CV</span>
                    <Download size={16} className="text-muted-foreground group-hover:text-foreground" />
                  </Button>
                </a>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md text-center">No CV uploaded</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center Column: Detailed Info */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
             <CardHeader className="border-b border-border pb-4 mb-4">
                <CardTitle>Volunteer Profile</CardTitle>
             </CardHeader>
             <CardContent className="space-y-8">
                
                {/* Motivation */}
                <div>
                   <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">Motivation</h4>
                   <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-xl italic">"{data.motivation}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Personal Details */}
                   <div>
                     <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2"><Users size={16}/> Personal Details</h4>
                     <ul className="space-y-3 text-sm">
                        <li className="flex justify-between"><span className="text-muted-foreground">Gender</span> <span className="font-medium">{data.gender}</span></li>
                        <li className="flex justify-between"><span className="text-muted-foreground">Date of Birth</span> <span className="font-medium">{new Date(data.dob).toLocaleDateString()}</span></li>
                        <li className="flex justify-between"><span className="text-muted-foreground">Blood Group</span> <span className="font-medium">{data.blood_group || '-'}</span></li>
                        <li className="flex justify-between"><span className="text-muted-foreground">Citizenship No.</span> <span className="font-medium">{data.citizenship_number || '-'}</span></li>
                     </ul>
                   </div>
                   
                   {/* Education & Languages */}
                   <div>
                     <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2"><GraduationCap size={16}/> Education & Languages</h4>
                     <ul className="space-y-3 text-sm">
                        <li className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Education Level</span> <span className="font-medium">{data.education_level}</span></li>
                        <li className="pt-1">
                           <span className="text-muted-foreground block mb-2">Languages Known</span> 
                           <div className="flex flex-wrap gap-2">
                              {data.languages?.map((lang: string) => (
                                 <span key={lang} className="bg-accent px-2.5 py-1 rounded-md text-xs font-medium">{lang}</span>
                              ))}
                           </div>
                        </li>
                     </ul>
                   </div>
                </div>

                {/* Skills & Interests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border">
                   <div>
                     <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">Skills</h4>
                     <div className="flex flex-wrap gap-2">
                        {data.skills?.map((skill: string) => (
                           <span key={skill} className="bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-3 py-1.5 rounded-lg text-xs font-semibold">{skill}</span>
                        ))}
                     </div>
                   </div>
                   <div>
                     <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">Areas of Interest</h4>
                     <div className="flex flex-wrap gap-2">
                        {data.interests?.map((interest: string) => (
                           <span key={interest} className="bg-emerald-600/10 text-emerald-600 border border-emerald-600/20 px-3 py-1.5 rounded-lg text-xs font-semibold">{interest}</span>
                        ))}
                     </div>
                   </div>
                </div>

                {/* Availability & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border">
                   <div>
                     <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2"><Clock size={16}/> Availability</h4>
                     <div className="space-y-4">
                        <div>
                           <span className="text-xs text-muted-foreground block mb-1">Days</span>
                           <div className="flex flex-wrap gap-1.5">
                              {data.available_days?.map((day: string) => (
                                 <span key={day} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">{day.substring(0,3)}</span>
                              ))}
                           </div>
                        </div>
                        <div>
                           <span className="text-xs text-muted-foreground block mb-1">Time</span>
                           <div className="flex flex-wrap gap-1.5">
                              {data.available_time?.map((time: string) => (
                                 <span key={time} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">{time}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                   </div>
                   <div>
                     <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2"><Briefcase size={16}/> Previous Experience</h4>
                     {data.previous_experience ? (
                        <div className="bg-muted/50 p-4 rounded-xl space-y-2 text-sm border border-border">
                           <p><span className="text-muted-foreground">Organization:</span> <span className="font-medium">{data.previous_organization}</span></p>
                           <p><span className="text-muted-foreground">Role:</span> <span className="font-medium">{data.previous_role}</span></p>
                           <p><span className="text-muted-foreground">Duration:</span> <span className="font-medium">{data.volunteer_duration}</span></p>
                        </div>
                     ) : (
                        <p className="text-sm text-muted-foreground">No previous volunteer experience.</p>
                     )}
                   </div>
                </div>

             </CardContent>
          </Card>

          {/* Admin Tools: Timeline & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
               <CardHeader className="pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Admin Notes</CardTitle>
                  <Button size="sm" variant="ghost" className="h-8 gap-1 text-brand-blue" onClick={() => setNoteModalOpen(true)}>
                     <Plus size={14} /> Add Note
                  </Button>
               </CardHeader>
               <CardContent>
                  {notes.length === 0 ? (
                     <p className="text-sm text-muted-foreground text-center py-4">No notes added yet.</p>
                  ) : (
                     <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {notes.map(note => (
                           <div key={note.id} className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-3 rounded-lg text-sm relative">
                              <p className="text-zinc-800 dark:text-zinc-200">{note.note}</p>
                              <span className="text-[10px] text-muted-foreground absolute top-2 right-3">{new Date(note.created_at).toLocaleDateString()}</span>
                           </div>
                        ))}
                     </div>
                  )}
               </CardContent>
             </Card>

             <Card>
               <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Activity Timeline</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                     {timeline.map((item, index) => (
                        <div key={item.id} className="relative pl-6 border-l-2 border-border last:border-transparent pb-1">
                           <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-brand-blue"></div>
                           <p className="text-sm font-semibold">{item.action_title}</p>
                           {item.action_description && <p className="text-xs text-muted-foreground mt-1">{item.action_description}</p>}
                           <p className="text-[10px] text-muted-foreground mt-2">{new Date(item.created_at).toLocaleString()}</p>
                        </div>
                     ))}
                  </div>
               </CardContent>
             </Card>
          </div>

        </div>
      </div>

      {/* Status Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status to <span className="text-brand-blue">{newStatus}</span></DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Add a note to timeline (Optional)</label>
            <Textarea 
               placeholder="e.g. Interview scheduled for Friday at 10 AM..."
               value={statusNote}
               onChange={(e) => setStatusNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={isUpdating} className="bg-brand-blue hover:bg-brand-blue/90">
               {isUpdating ? "Updating..." : "Confirm Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Note Modal */}
      <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Admin Note</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Note Content</label>
            <Textarea 
               placeholder="Write internal note here..."
               value={newAdminNote}
               onChange={(e) => setNewAdminNote(e.target.value)}
               className="h-32"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNote} disabled={isAddingNote || !newAdminNote.trim()} className="bg-brand-blue hover:bg-brand-blue/90">
               {isAddingNote ? "Adding..." : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
