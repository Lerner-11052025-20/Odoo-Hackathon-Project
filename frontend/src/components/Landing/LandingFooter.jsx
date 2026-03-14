import React from 'react';
import { Package, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingFooter = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 pt-20 pb-10 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">CoreInventory</span>
            </Link>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
              Empowering logistics teams and warehouse managers with the tools they need to achieve 99.9% inventory accuracy.
            </p>
            <div className="flex items-center gap-4">
              {[Github, Linkedin, Twitter, Mail].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500 hover:shadow-lg transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 underline decoration-primary-500/30 decoration-2 underline-offset-8">Platform</h4>
            <ul className="space-y-4">
              {['Features', 'Workflow', 'How It Works', 'Documentation', 'Move History'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 underline decoration-primary-500/30 decoration-2 underline-offset-8">Support</h4>
            <ul className="space-y-4">
              {['Help Center', 'API Status', 'Privacy Policy', 'Security', 'Legal'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-slate-400">
            © 2026 CoreInventory. Built with excellence for operational mastery.
          </p>
          <div className="flex items-center gap-8 text-xs font-medium text-slate-400">
            <a href="#" className="hover:text-primary-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-primary-500 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
