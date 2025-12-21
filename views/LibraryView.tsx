import React, { useState, useMemo } from "react";
import { Search, Box, ExternalLink, ArrowRight, Puzzle } from "lucide-react";
import { toolLibrary, extensions, writeups } from "../data";
import { TabView, ResourceTool, Extension } from "../types";

export const LibraryView = ({ type }: { type: TabView }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isFirefox = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /firefox/i.test(navigator.userAgent);
  }, []);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    if (type === 'library') {
      toolLibrary.forEach(tool => categories.add(tool.category));
    } else if (type === 'extensions') {
      extensions.forEach(ext => categories.add(ext.category));
    } else if (type === 'writeups') {
      writeups.forEach(w => categories.add(w.category));
    }
    return Array.from(categories).sort();
  }, [type]);

  const filteredTools = useMemo(() => {
    return toolLibrary.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? t.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredExtensions = useMemo(() => {
    return extensions.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? e.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredWriteups = useMemo(() => {
    return writeups.filter(w => {
      const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? w.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-300">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            {type === 'library' ? 'Security Tools' : type === 'extensions' ? 'Browser Extensions' : 'Bug Hunting Writeups'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Curated resources to enhance your workflow. Updated weekly.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full md:w-72">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus-within:bg-black/40 focus-within:border-white/20 transition-all">
            <Search className="w-4 h-4 text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-600 w-full"
            />
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${selectedCategory === null
            ? "bg-white text-black border-white"
            : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
        >
          All
        </button>
        {allCategories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${selectedCategory === category
              ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/25"
              : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-16">
        {type === 'library' && Object.entries(
          filteredTools.reduce((acc, tool) => {
            if (!acc[tool.category]) acc[tool.category] = [];
            acc[tool.category].push(tool);
            return acc;
          }, {} as Record<string, ResourceTool[]>)
        ).map(([category, tools]: [string, ResourceTool[]]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-indigo-500 rounded-full" />
              {category}
              <span className="text-sm font-normal text-gray-500 ml-2">({tools.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, idx) => (
                <a
                  key={idx}
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer block h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-white">
                      <Box className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">{tool.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-xs font-bold text-white tracking-wider uppercase mt-auto">
                    {tool.link.includes("github.com") ? "View on GitHub" : "View Website"} <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {type === 'extensions' && Object.entries(
          filteredExtensions.reduce((acc, ext) => {
            if (!acc[ext.category]) acc[ext.category] = [];
            acc[ext.category].push(ext);
            return acc;
          }, {} as Record<string, Extension[]>)
        ).map(([category, exts]: [string, Extension[]]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-indigo-500 rounded-full" />
              {category}
              <span className="text-sm font-normal text-gray-500 ml-2">({exts.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exts.map((ext, idx) => (
                <a
                  key={idx}
                  href={isFirefox ? ext.firefoxLink : ext.chromeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer block h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-white">
                      <Puzzle className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-gray-400 border border-white/5 uppercase tracking-wider">
                      {isFirefox ? 'Firefox' : 'Chrome'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{ext.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">{ext.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ext.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-xs font-bold text-white tracking-wider uppercase mt-auto">
                    Get Extension <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {type === 'writeups' && Object.entries(
          filteredWriteups.reduce((acc, writeup) => {
            if (!acc[writeup.category]) acc[writeup.category] = [];
            acc[writeup.category].push(writeup);
            return acc;
          }, {} as Record<string, typeof writeups>)
        ).map(([category, categoryWriteups]: [string, typeof writeups]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-indigo-500 rounded-full" />
              {category}
              <span className="text-sm font-normal text-gray-500 ml-2">({categoryWriteups.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryWriteups.map((writeup, idx) => (
                <a key={idx} href={writeup.link} target="_blank" rel="noopener noreferrer" className="group col-span-1 md:col-span-3 lg:col-span-1 p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer flex flex-col h-full">
                  <div className="mb-auto">
                    <div className="flex items-center gap-3 mb-6 text-xs font-medium text-gray-500 uppercase tracking-widest">
                      <span>{writeup.platform}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span>{writeup.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-indigo-300 transition-colors">
                      {writeup.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {writeup.subtitle}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-xs font-bold text-gray-500">{writeup.readTime} read</span>
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/20 transition-colors">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
