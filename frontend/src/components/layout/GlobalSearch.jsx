import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, ArrowRight, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState({ products: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search effect
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          // Fetch and filter products client-side for now (since we don't have a dedicated search endpoint)
          const res = await api.get('/products');
          const term = query.toLowerCase();
          const pMatch = res.data.data.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.sku.toLowerCase().includes(term)
          );
          setResults({ products: pMatch.slice(0, 5) }); // Top 5
          setIsOpen(true);
        } catch (error) {
          console.error('Search failed', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsOpen(false);
        setResults({ products: [] });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleSelect = (item, type) => {
    setIsOpen(false);
    setQuery('');
    if (type === 'product') {
      navigate('/products');
    }
  };

  return (
    <div className="relative w-full max-w-md hidden md:block">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if(query.length >= 2) setIsOpen(true); }}
          placeholder="Search products, orders, or operations... (Press '/')"
          className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700/50 z-50 overflow-hidden"
          >
            {isLoading ? (
              <div className="p-4 flex items-center justify-center text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm font-medium">Searching...</span>
              </div>
            ) : (
              <div className="py-2">
                {results.products.length > 0 ? (
                  <>
                    <h4 className="px-4 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Products Match</h4>
                    <div className="flex flex-col">
                      {results.products.map(p => (
                        <button
                          key={p._id}
                          onClick={() => handleSelect(p, 'product')}
                          className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                              <Package size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{p.sku}</p>
                            </div>
                          </div>
                          <ArrowRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center">
                    <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-900 dark:text-white">No results found</p>
                    <p className="text-xs text-slate-500 mt-1">Try searching for a different term.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
