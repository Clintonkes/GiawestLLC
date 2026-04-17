"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingCalculator } from "@/components/PricingCalculator";
import { ContactSection } from "@/components/ContactSection";
import { TrucksSection } from "@/components/TrucksSection";
import { useState } from "react";
import { 
  ArrowRight, 
  Search, 
  Shield, 
  Clock, 
  Globe, 
  TrendingUp, 
  ChevronRight,
  Package,
  Truck,
  Calendar,
  MapPin,
  CheckCircle2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Remove any hash the browser added
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    // Handle ?section= query from cross-page nav
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    if (section) {
      setTimeout(() => {
        if (section === "hero") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const el = document.getElementById(section);
          if (el) {
            const offset = 80;
            const pos = el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offset;
            window.scrollTo({ top: pos, behavior: "smooth" });
          }
        }
        window.history.replaceState(null, "", "/");
      }, 100);
    }
  }, []);

  const [trackQuery, setTrackQuery] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery) return;
    
    setIsTracking(true);
    setTrackError("");
    setTrackResult(null);
    
    try {
      const result = await api.trackOrder(trackQuery);
      setTrackResult(result);
    } catch (err: any) {
      setTrackError("Order not found or tracking failed. Please check your reference.");
    } finally {
      setIsTracking(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section id="hero" className="relative flex min-h-screen items-center overflow-hidden bg-primary pt-28 text-white sm:pt-32 md:h-screen md:pt-20">
        {/* Abstract Background Animation */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3B82F6,transparent_70%)] animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 sm:py-10 md:py-0 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">New: Express Routes Available</span>
            </div>
            <h1 className="max-w-[10ch] text-4xl leading-[0.95] sm:text-5xl md:max-w-none md:text-7xl font-heading font-black mb-6 md:leading-tight">
              Logistics for the <span className="text-accent">Modern</span> World.
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 md:mb-10 max-w-xl">
              Florida Prod Market LLC provides a seamless, data-driven platform to manage your global freight and truckload operations with absolute precision.
            </p>
            
            <div className="flex flex-col items-stretch sm:items-center gap-4">
              <button onClick={() => window.location.href='/quote'} className="btn-accent w-full sm:w-auto flex items-center justify-center space-x-2 group">
                <span>Ship with Us</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-3 text-white/80 hover:text-white font-semibold flex items-center justify-center space-x-2 transition-colors">
                <span>View Our Network</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Shipment Tracking Widget */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-6 sm:p-8 text-primary"
          >
            <h3 className="text-2xl font-heading font-bold mb-6 flex items-center space-x-2">
              <Search className="h-5 w-5 text-accent" />
              <span>Track Your Freight</span>
            </h3>
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value.toUpperCase())}
                  placeholder="Enter Order or Truck Number" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                />
                <button 
                  type="submit"
                  disabled={isTracking}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {isTracking ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <ArrowRight className="h-5 w-5" />}
                </button>
              </div>
              
              <AnimatePresence>
                {trackError && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-500 font-bold"
                  >
                    {trackError}
                  </motion.p>
                )}
                
                {trackResult && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl relative"
                  >
                    <button onClick={() => setTrackResult(null)} className="absolute top-2 right-2 text-slate-400 hover:text-primary">
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase text-slate-400">Order: {trackResult.order_number}</span>
                      <span className="px-2 py-0.5 bg-accent text-white rounded font-black text-[10px] uppercase">{trackResult.status}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white shadow-sm border border-slate-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-accent" />
                        </div>
                        <div className="text-sm">
                          <div className="text-slate-400 text-[10px] uppercase font-bold">Origin → Destination</div>
                          <div className="font-bold">{trackResult.pickup_location.split(',')[0]} → {trackResult.delivery_location.split(',')[0]}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center space-x-3">
                  <Package className="h-5 w-5 text-accent" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Shipments</div>
                    <div className="text-sm font-bold">12 Active</div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Growth</div>
                    <div className="text-sm font-bold">+24% YoY</div>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Annual Shipments", val: "50,000+" },
              { label: "Global Partners", val: "1,200+" },
              { label: "Reliability Rate", val: "99.9%" },
              { label: "Support Avail.", val: "24/7" },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <div className="text-3xl md:text-4xl font-heading font-black text-primary">{stat.val}</div>
                <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <PricingCalculator />

      {/* Modern Services Grid */}
      <section className="py-24 bg-primary text-white" id="services">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:row items-end justify-between mb-16 gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-accent mb-4">Our Expertise</h2>
              <h3 className="text-4xl md:text-5xl font-heading font-black mb-6">Integrated Freight & Supply Chain Services.</h3>
            </div>
            <p className="text-slate-400 max-w-sm">
              From local drayage to international multi-modal transport, we provide the infrastructure for global commerce.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Full Truckload", desc: "Dedicated capacity for your largest shipments with 24/7 GPS monitoring.", icon: Truck },
              { title: "LTL Shipping", desc: "Cost-effective solutions for smaller freight using our optimized network.", icon: Package },
              { title: "Temp Controlled", desc: "Precision climate management for sensitive or perishable goods.", icon: Shield },
              { title: "Expedited", desc: "Urgent delivery services when every minute counts toward your bottom line.", icon: Clock },
            ].map((service, i) => (
              <motion.div 
                key={service.title}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group flex flex-col h-full"
              >
                <service.icon className="h-10 w-10 text-accent mb-6" />
                <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">{service.desc}</p>
                <div className="pt-4 border-t border-white/10 mt-auto">
                    <button className="text-sm font-black uppercase tracking-widest flex items-center group-hover:text-accent transition-colors">
                        Learn More <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Network Section */}
      <section className="section-padding overflow-hidden" id="network">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-accent mb-4">Global Reach</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-black text-primary mb-6">A Connected Network of Logistics Excellence.</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Operating across 150+ hubs worldwide, Florida Prod Market LLC ensures your freight moves across borders with zero friction. Our digital infrastructure bridges the gap between physical assets and information flow.
            </p>
            <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-surface rounded-2xl border border-slate-100">
                    <div className="text-3xl font-black text-primary mb-1">15+</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Ports</div>
                </div>
                <div className="p-6 bg-surface rounded-2xl border border-slate-100">
                    <div className="text-3xl font-black text-primary mb-1">2.4M</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sq. Ft. Warehousing</div>
                </div>
            </div>
          </motion.div>
          <div className="relative">
            <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden relative group">
                <div className="absolute inset-0 bg-accent/10 mix-blend-multiply transition-all group-hover:bg-accent/5" />
                {/* Abstract Data Map Visualization */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1494412519320-aa3da5905a19?auto=format&fit=crop&q=80&w=2000"
                      alt="Global Logistics Network"
                      className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-6 glass-card text-center max-w-[200px]">
                        <Globe className="h-8 w-8 text-accent mx-auto mb-3 animate-spin-slow" />
                        <div className="font-black text-primary">Live Network Active</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding" id="about">
        <div className="text-center mb-20">
          <motion.div {...fadeInUp}>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-accent mb-4">Precision Logistics</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-black text-primary mb-6">Why Modern Businesses Choose Florida Prod Market</h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              We leverage cutting-edge technology and human expertise to build more efficient, sustainable, and reliable supply chains.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Enterprise Security",
              desc: "Every shipment is tracked and monitored with multi-layered insurance and real-time alerts."
            },
            {
              icon: Clock,
              title: "Just-In-Time Delivery",
              desc: "Optimized route planning ensures your freight arrives exactly when it's needed, reducing overhead."
            },
            {
              icon: Globe,
              title: "Global Visibility",
              desc: "Access a worldwide network with unified reporting and centralized communication."
            }
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              {...fadeInUp}
              transition={{ delay: i * 0.2 }}
              className="p-8 bg-surface rounded-3xl border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-accent transition-colors duration-500">
                <item.icon className="h-8 w-8 text-accent group-hover:text-white transition-colors duration-500" />
              </div>
              <h4 className="text-2xl font-heading font-bold mb-4">{item.title}</h4>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-accent text-white rounded-[4rem] mb-24 mx-4 md:mx-auto max-w-7xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:row items-center justify-between gap-12 text-center md:text-left">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-6">Ready to Optimize Your Supply Chain?</h2>
            <p className="text-blue-100 text-lg max-w-2xl">
              Join thousands of businesses that trust Florida Prod Market LLC for their most critical freight operations. 
              Get your personalized quote in minutes.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href='/quote'}
            className="px-10 py-5 bg-white text-accent rounded-2xl font-black text-xl shadow-2xl hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            Request a Quote
          </motion.button>
        </div>
      </section>

      <TrucksSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
