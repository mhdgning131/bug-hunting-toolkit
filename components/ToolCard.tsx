import React from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon } from "lucide-react";
import { CommandTool } from "../types";
import { AcrylicTerminal } from "./AcrylicTerminal";

export const ToolCard = ({ tool, domain }: { tool: CommandTool; domain: string; key?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 group shadow-xl shadow-black/20"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
          <TerminalIcon className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">{tool.name}</h3>
      <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">{tool.description}</p>

      <AcrylicTerminal command={tool.commandTemplate(domain || "target.com")} />
    </motion.div>
  );
};
