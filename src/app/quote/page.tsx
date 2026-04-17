"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  Truck,
  ArrowRight
} from "lucide-react";
import { api } from "@/services/api";

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    pickup_location: "",
    delivery_location: "",
    goods_type: "",
    cargo_weight: "",
    cargo_size: "",
    preferred_date: "",
    additional_notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Ensure date is in correct format
      const finalData = {
        ...formData,
        preferred_date: new Date(formData.preferred_date).toISOString()
      };
      
      const result = await api.createOrder(finalData);
      setOrderNumber(result.order_number);
      setIsSuccess(true);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface">
      <Header />
      
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-black text-primary mb-4">Request a Premium Quote</h1>
            <p className="text-slate-600">Florida Prod Market LLC provides instant logistics assessments for your global freight needs.</p>
          </div>

          <div className="flex justify-between items-center mb-12 max-w-md mx-auto relative px-2">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 transition-all duration-500 z-10" 
              style={{ width: `${(step - 1) * 50}%` }}
            />
            
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm relative z-20 transition-all duration-300 ${
                  step >= s ? "bg-accent text-white scale-110 shadow-lg shadow-accent/40" : "bg-white text-slate-400 border-2 border-slate-200"
                }`}
              >
                {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
              </div>
            ))}
          </div>

          {!isSuccess ? (
            <div className="glass-card overflow-hidden">
              <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <MapPin className="text-accent" />
                        Route & Contact Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Full Name</label>
                          <input 
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            type="text" 
                            className="form-input-premium w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-accent" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Email Address</label>
                          <input 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email" 
                            className="form-input-premium w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-accent" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Pickup Location</label>
                          <input 
                            name="pickup_location"
                            value={formData.pickup_location}
                            onChange={handleChange}
                            type="text" 
                            placeholder="City, State or Port"
                            className="form-input-premium w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-accent" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Delivery Location</label>
                          <input 
                            name="delivery_location"
                            value={formData.delivery_location}
                            onChange={handleChange}
                            type="text" 
                            placeholder="City, State or Port"
                            className="form-input-premium w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-accent" 
                         />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Package className="text-accent" />
                        Cargo Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2">
                          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Goods Description</label>
                          <input 
                            name="goods_type"
                            value={formData.goods_type}
                            onChange={handleChange}
                            type="text" 
                            placeholder="e.g. Electronics, Perishables, Machinery"
                            className="form-input-premium w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-accent" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Cargo Weight (lbs/kg)</label>
                          <input 
                            name="cargo_weight"
                            value={formData.cargo_weight}
                            onChange={handleChange}
                            type="text" 
                            className="form-input-premium w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-accent" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Preferred Date</label>
                          <input 
                            name="preferred_date"
                            value={formData.preferred_date}
                            onChange={handleChange}
                            type="datetime-local" 
                            className="form-input-premium w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-accent" 
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Calendar className="text-accent" />
                        Finalize Request
                      </h3>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                        <div className="flex justify-between border-b pb-3">
                          <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Route</span>
                          <span className="font-bold text-sm">{formData.pickup_location} → {formData.delivery_location}</span>
                        </div>
                        <div className="flex justify-between border-b pb-3">
                          <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Cargo</span>
                          <span className="font-bold text-sm">{formData.goods_type}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Additional Instructions</label>
                        <textarea 
                          name="additional_notes"
                          value={formData.additional_notes}
                          onChange={handleChange}
                          rows={4} 
                          className="form-input-premium w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-accent" 
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between pt-12">
                  {step > 1 ? (
                    <button onClick={prevStep} className="flex items-center space-x-2 text-slate-500 hover:text-primary transition-colors font-bold">
                      <ChevronLeft className="h-5 w-5" />
                      <span>Back</span>
                    </button>
                  ) : <div />}

                  {step < 3 ? (
                    <button onClick={nextStep} className="btn-accent flex items-center space-x-2">
                      <span>Continue</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="btn-accent flex items-center space-x-2 px-10"
                    >
                      {isSubmitting ? "Processing..." : "Submit Quote Request"}
                      {!isSubmitting && <ArrowRight className="h-5 w-5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-heading font-black text-primary mb-4">Request Submitted!</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Thank you, <span className="font-bold text-primary">{formData.customer_name}</span>. Your request has been received and is being processed by our specialists.
              </p>
              
              <div className="bg-primary text-white p-8 rounded-3xl mb-8 max-w-sm mx-auto shadow-2xl">
                <div className="text-[10px] uppercase font-black tracking-[0.3em] mb-2 text-blue-300">Tracking Reference</div>
                <div className="text-4xl font-black">{orderNumber}</div>
              </div>

              <div className="flex flex-col sm:row items-center justify-center gap-4">
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="btn-primary"
                >
                  Return Home
                </button>
                <button className="text-slate-500 font-bold hover:text-primary transition-colors">
                  Check Email Status
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
