"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { api } from "@/services/api";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContact(formData);
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (err) {
      console.error("Failed to send contact inquiry:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-accent mb-4">Connect with Us</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-black text-primary mb-6">Contact Florida Prod Market LLC.</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Have a question about our freight services or global network? Our dedicated support team is ready to assist you 24/7.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="p-8 bg-surface rounded-3xl border border-slate-100">
              <h4 className="text-xl font-bold mb-8">Direct Channels</h4>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Inquiry</div>
                    <div className="font-bold text-primary">floridaprod@proton.me</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Call Support</div>
                    <div className="font-bold text-primary">863-286-4824</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">HQ Office</div>
                    <div className="font-bold text-primary">235 Apollo Beach Blvd Num 305, Apollo Beach, FL 33572</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-primary text-white rounded-3xl shadow-xl relative overflow-hidden">
                {/* Abstract Data Flow Decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full blur-2xl" />
                </div>
                <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-4">Urgent Freight?</h4>
                    <p className="text-slate-300 text-sm mb-6">Access our expedited coordination team for time-critical shipments that require immediate attention.</p>
                    <button className="text-sm font-black uppercase tracking-widest text-accent hover:text-white transition-colors">Start Expedited Quote →</button>
                </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-10 bg-white shadow-2xl shadow-slate-200 border border-slate-100 rounded-[2.5rem]">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <h4 className="text-3xl font-heading font-black mb-4">Message Sent!</h4>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        Thank you for your inquiry. A logistics coordinator will review your request and get back to you within 60 minutes.
                    </p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="text-sm font-black uppercase tracking-widest text-accent hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit} 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 bg-surface border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-4 bg-surface border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Subject</label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-5 py-4 bg-surface border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium appearance-none"
                      >
                        <option>General Inquiry</option>
                        <option>Rate Quote</option>
                        <option>Carrier Application</option>
                        <option>Media & PR</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Message Details</label>
                      <textarea 
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-5 py-4 bg-surface border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium resize-none"
                        placeholder="How can we help your business move forward?"
                      />
                    </div>
                    <div className="md:col-span-2 pt-4">
                      <button 
                        disabled={isSubmitting}
                        className="w-full px-8 py-5 bg-primary text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                      >
                        <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
