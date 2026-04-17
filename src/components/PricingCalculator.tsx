"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, MapPin, Package, ArrowRight, TrendingUp, ShieldCheck, Zap, Truck } from "lucide-react";
import Link from "next/link";

export function PricingCalculator() {
  const [distance, setDistance] = useState(500);
  const [weight, setWeight] = useState(10000);
  const [type, setType] = useState("ftl"); // ftl, ltl, express
  const [estimate, setEstimate] = useState(0);

  useEffect(() => {
    // Basic calculation logic
    let base = type === "ftl" ? 2.5 : type === "ltl" ? 1.8 : 4.5;
    let weightFactor = weight / 1000 * 0.5;
    let total = (distance * base) + (weightFactor * distance * 0.1);
    setEstimate(Math.round(total));
  }, [distance, weight, type]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24" id="pricing">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-accent mb-4">Pricing Transparency</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-black text-primary mb-8 leading-tight">
            Institutional Pricing for <span className="text-accent underline decoration-blue-200 underline-offset-8">Everyone</span>.
          </h3>
          <p className="text-slate-600 text-lg mb-10 leading-relaxed max-w-xl">
            No more hidden fees or complex spreadsheets. Use our real-time estimator to calculate your logistics overhead instantly.
          </p>
          
          <div className="space-y-6">
            {[
              { icon: ShieldCheck, title: "Price Guarantee", desc: "Our quotes are locked for 48 hours for your convenience." },
              { icon: Zap, title: "Market Optimized", desc: "We pull real-time data to ensure you get the best market rates." }
            ].map(item => (
              <div key={item.title} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 flex items-center justify-center rounded-xl shrink-0">
                  <item.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-primary">{item.title}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-10 md:p-12 relative overflow-hidden"
        >
          {/* Background Highlight */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          
          <div className="space-y-8 relative z-10">
            {/* Type Selector */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {['ftl', 'ltl', 'express'].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-3 text-xs md:text-sm font-black uppercase tracking-wider rounded-xl transition-all ${
                    type === t ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Distance Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black uppercase text-slate-500 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  Estimated Distance
                </label>
                <span className="text-2xl font-black text-primary">{distance} <span className="text-xs text-slate-400">Miles</span></span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="3000" 
                step="50"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

            {/* Weight Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black uppercase text-slate-500 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-accent" />
                  Estimated Weight
                </label>
                <span className="text-2xl font-black text-primary">{weight.toLocaleString()} <span className="text-xs text-slate-400">LBS</span></span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="45000" 
                step="500"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-sm font-black uppercase text-slate-400 tracking-widest mb-1">Estimated Quote</div>
                  <div className="text-5xl font-heading font-black text-primary flex items-start">
                    <span className="text-xl mt-1.5 mr-1 text-slate-400">$</span>
                    {estimate.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-green-500 bg-green-50 px-2 py-1 rounded inline-block mb-2 italic">Standard Rate</div>
                  <div className="text-xs text-slate-400 font-medium">*Pending final assessment</div>
                </div>
              </div>

              <Link href="/quote" className="w-full btn-accent py-5 flex items-center justify-center space-x-3 group">
                <span className="text-lg">Secure This Rate</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
