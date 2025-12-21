import React, { useState, useMemo } from "react";
import { CheckCircle2, Copy } from "lucide-react";

export const AcrylicTerminal = ({ command }: { command: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax Highlighting Logic
  const highlightedCommand = useMemo(() => {
    return command.split(/(\s+|[|>&;])/).map((part, index) => {
      if (part.match(/^-\w+/)) {
        // Flags (e.g., -d, -recursive)
        return <span key={index} className="text-yellow-400 font-medium">{part}</span>;
      } else if (part.match(/^[|>&;]+$/)) {
        // Operators (|, >, &&)
        return <span key={index} className="text-pink-500 font-bold">{part}</span>;
      } else if (part.match(/\.(txt|json|xml|php|js|log|zip)$/)) {
        // File extensions
        return <span key={index} className="text-emerald-400 italic">{part}</span>;
      } else {
        // Default text
        return <span key={index}>{part}</span>;
      }
    });
  }, [command]);

  return (
    <div className="relative group mt-4 rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-inner backdrop-blur-md font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        <div className="ml-auto text-xs text-gray-600 font-medium">bash</div>
      </div>

      <div className="p-4 overflow-x-auto custom-scrollbar">
        <code className="text-blue-200 whitespace-nowrap leading-relaxed">
          {highlightedCommand}
        </code>
      </div>

      <button
        onClick={handleCopy}
        className="absolute bottom-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};
