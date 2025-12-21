import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { commandCategories, commandTools } from "../data";
import { SectionHeader } from "../components/SectionHeader";
import { ToolCard } from "../components/ToolCard";
import { validTLDs } from "../tlds";

export const GeneratorView = ({ domain, setDomain }: { domain: string, setDomain: (d: string) => void }) => {
  const validationState = useMemo(() => {
    if (!domain) return 'empty';
    const structureValid = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(domain);
    if (!structureValid) return 'invalid_format';

    const parts = domain.split('.');
    const tld = parts[parts.length - 1].toLowerCase();
    return validTLDs.has(tld) ? 'valid' : 'invalid_tld';
  }, [domain]);

  const isValid = validationState === 'valid';

  return (
    <div className="pb-32 pt-12">
      <div className="flex flex-col items-center justify-center mb-16 relative z-10">
        <motion.div
          className="text-xs font-bold tracking-[0.3em] text-gray-500 mb-4 border border-white/10 px-4 py-1.5 rounded-full uppercase backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Bug Hunting Toolkit V0.1
        </motion.div>

        <div className="w-full max-w-3xl relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 rounded-[40px] pointer-events-none" />

          <div className={`relative bg-white/5 backdrop-blur-2xl border rounded-[32px] p-2 shadow-2xl transition-all duration-300 focus-within:bg-black/40 ${!isValid && domain.length > 0 ? 'border-red-500/50' : 'border-white/10 focus-within:border-white/20'}`}>
            <div className="flex items-center px-6 py-1">
              <Search className={`w-6 h-6 transition-colors duration-300 ${isValid ? 'text-emerald-400' : domain.length > 0 ? 'text-red-400' : 'text-gray-400'}`} strokeWidth={2} />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="target.com"
                className="w-full bg-transparent border-none focus:ring-0 text-2xl font-semibold text-white placeholder-gray-600 px-6 py-2 outline-none tracking-tight"
                autoFocus
              />
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 whitespace-nowrap ${isValid ? 'bg-emerald-500/20 text-emerald-400' : domain.length > 0 ? 'bg-red-500/20 text-red-400' : 'bg-transparent text-gray-600'}`}>
                {isValid ? 'READY' : validationState === 'invalid_tld' ? 'INVALID TLD' : domain.length > 0 ? 'INVALID URL' : 'ENTER SCOPE'}
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative z-10 flex flex-wrap justify-center gap-2 mt-8 max-w-9xl mx-auto"
          >
            {commandCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-3 py-1.5 rounded-full border text-[10px] font-medium transition-all uppercase tracking-wider ${cat.type === 'system'
                    ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/40'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                  }`}
              >
                {cat.title}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 gap-y-6">
          {commandCategories.filter(c => !c.id.startsWith('dork_')).map((category) => {
            const tools = commandTools.filter(t => t.category === category.id);
            if (tools.length === 0) return null;

            return (
              <React.Fragment key={category.id}>
                <SectionHeader
                  id={category.id}
                  title={category.title}
                  subtitle={tools[0].description.split(' ').slice(0, 5).join(' ') + '...'}
                  icon={category.icon}
                />
                {category.type === 'system' && (
                  <div className="col-span-full -mt-4 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      System / CLI Tool
                    </span>
                  </div>
                )}
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} domain={isValid ? domain : ""} />
                ))}
              </React.Fragment>
            );
          })}
        </div>

        {commandCategories.some(c => c.id.startsWith('dork_')) && (
          <div className="mt-24">


            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 gap-y-6">
              {commandCategories.filter(c => c.id.startsWith('dork_')).map((category) => {
                const tools = commandTools.filter(t => t.category === category.id);
                if (tools.length === 0) return null;

                return (
                  <React.Fragment key={category.id}>
                    <SectionHeader
                      id={category.id}
                      title={category.title.replace('Google Dorks: ', '')}
                      subtitle={tools[0].description}
                      icon={category.icon}
                    />
                    {tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} domain={isValid ? domain : ""} />
                    ))}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
