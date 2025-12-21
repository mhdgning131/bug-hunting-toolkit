import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  Database,
  User,
  BookOpen,
  Puzzle,
  ArrowUp,
  Search
} from "lucide-react";

import { TabView } from "./types";
import { GeneratorView } from "./views/GeneratorView";
import { LibraryView } from "./views/LibraryView";
import { ProfileView } from "./views/ProfileView";

// --- Main App Component ---

const App = () => {
  const [domain, setDomain] = useState(() => {
    return localStorage.getItem('targetDomain') || "";
  });
  const [activeTab, setActiveTab] = useState<TabView>(() => {
    return (localStorage.getItem('activeTab') as TabView) || "generator";
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Persist domain to localStorage when it changes
  const handleDomainChange = (newDomain: string) => {
    setDomain(newDomain);
    localStorage.setItem('targetDomain', newDomain);
  };

  // Smooth scroll to top when tab changes & persist tab
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Handle scroll for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-gray-200 selection:bg-indigo-500/30 bg-black relative overflow-x-hidden">
      {/* Fixed Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-black z-0 pointer-events-none"></div>
      {/* Fixed Background Grain/Grid optional */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay"></div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white shadow-lg hover:bg-white/20 transition-all z-50 group"
          >
            <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'generator' && (
            <motion.div key="generator" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
              <GeneratorView domain={domain} setDomain={handleDomainChange} />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
              <ProfileView domain={domain} />
            </motion.div>
          )}
          {activeTab !== 'generator' && activeTab !== 'profile' && (
            <motion.div key="library" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
              <LibraryView type={activeTab} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dock Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 p-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50">
          {[
            { id: "generator", icon: Command, label: "Generator" },
            { id: "library", icon: Database, label: "Tools" },
            { id: "extensions", icon: Puzzle, label: "Extensions" },
            { id: "writeups", icon: BookOpen, label: "Writeups" },
            { id: "profile", icon: User, label: "Profile" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabView)}
              className={`relative group p-3 rounded-full transition-all duration-300 ${activeTab === item.id
                ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <item.icon className={`w-6 h-6 transition-transform duration-300 ${activeTab === item.id ? "scale-110" : "group-hover:scale-110"}`} strokeWidth={1.5} />

              {/* Tooltip */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/80 border border-white/10 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
                {item.label}
              </span>

              {/* Active Indicator */}
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full border border-white/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
