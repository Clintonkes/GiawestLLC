"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Box, Zap, Shield } from "lucide-react";
import { api } from "@/services/api";

const getImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // Use a fallback for local development if the env var is missing
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const baseUrl = apiBase.replace(/\/api$/, '') || 'http://localhost:8000';
  
  // Ensure the URL starts with a slash
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanUrl}`;
};

const getIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("van")) return <Box className="h-6 w-6 text-accent" />;
  if (t.includes("reefer")) return <Zap className="h-6 w-6 text-accent" />;
  return <Truck className="h-6 w-6 text-accent" />;
};

const getFeatures = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("semi")) return ["Long-haul", "Telematic Tracking", "Eco-Friendly"];
  if (t.includes("van")) return ["Last-mile", "Urban Optimized", "Express Delivery"];
  if (t.includes("reefer")) return ["Temperature Controlled", "Medical Grade", "Real-time Monitoring"];
  return ["GPS Tracked", "Fully Insured", "Heavy Duty"];
};

export function TrucksSection() {
  const [fleet, setFleet] = useState<any[]>([]);

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const data = await api.getTrucks();
        setFleet(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load fleet", err);
      }
    };
    fetchFleet();
  }, []);
  return (
    <section id="fleet" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6"
            >
              The Florida Prod Market <span className="text-accent underline decoration-blue-200 underline-offset-8">Goliath</span> Fleet
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 leading-relaxed"
            >
              Our diverse fleet is maintained to the highest standards, ensuring your cargo 
              reaches its destination safely and on time. From urban last-mile to cross-country heavy hauling.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center space-x-2 text-sm font-bold text-accent uppercase tracking-widest bg-accent/5 px-4 py-2 rounded-full border border-accent/10"
          >
            <Shield className="h-4 w-4" />
            <span>Fully Insured & Tracked</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fleet.slice(0, 3).map((truck, idx) => (
            <motion.div
              key={truck.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-accent/5"
            >
              <div className="aspect-[16/10] relative overflow-hidden bg-slate-200">
                {truck.image_url ? (
                  <img 
                    src={getImageUrl(truck.image_url)} 
                    alt={truck.truck_type}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { 
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = ''; // Clear source
                      target.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-slate-100', 'to-slate-200');
                      // Add a fallback icon via JS manipulation if possible
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <Truck className="h-16 w-16 text-slate-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    {getIcon(truck.truck_type)}
                  </div>
                  <span className="text-xs font-bold text-accent uppercase tracking-tighter">{truck.truck_number}</span>
                </div>
                
                <h3 className="text-xl font-heading font-bold text-primary mb-2">{truck.truck_type}</h3>
                <p className="text-sm text-slate-500 mb-6">Capacity: <span className="text-slate-900 font-semibold">{truck.capacity}</span></p>
                
                <div className="flex flex-wrap gap-2">
                  {getFeatures(truck.truck_type).map(feature => (
                    <span key={feature} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white text-slate-600 rounded-md border border-slate-200">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
