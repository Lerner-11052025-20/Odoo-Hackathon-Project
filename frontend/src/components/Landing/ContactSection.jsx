import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-primary-500/5 blur-[100px] rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-tight leading-[1.1]"
            >
              Have <span className="gradient-text">Questions</span>?<br />We're Here to Help.
            </motion.h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-lg">
               Our team is ready to discuss how CoreInventory can be customized specifically for your warehouse architecture and operational needs.
            </p>

            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email Us', value: 'care_firm@coreinventory.com' },
                { icon: Phone, label: 'Call Support', value: '+91 9876543210' },
                { icon: MapPin, label: 'Global HQ', value: 'New delhi,INDIA' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-primary-500/5"
          >
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="demo user"
                    className="auth-input !py-4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Work Email</label>
                  <input 
                    type="email" 
                    placeholder="demo@company.com"
                    className="auth-input !py-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Message</label>
                <textarea 
                  rows="4"
                  placeholder="Tell us about your inventory needs..."
                  className="auth-input !py-4 resize-none"
                ></textarea>
              </div>

              <button className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
                 Send Message <Send size={18} />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
