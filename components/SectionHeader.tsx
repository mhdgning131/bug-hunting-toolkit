import React from "react";
import { motion } from "framer-motion";

export const SectionHeader = ({ title, subtitle, icon: Icon, id }: { title: string; subtitle: string; icon: any; id?: string }) => (
  <motion.div 
    id={id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="col-span-full flex items-center gap-4 mb-2 mt-12 first:mt-0 scroll-mt-32"
  >
    <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
      <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
    </div>
    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-6" />
  </motion.div>
);
