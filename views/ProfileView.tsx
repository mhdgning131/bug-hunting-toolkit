import React from "react";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export const ProfileView = ({ domain }: { domain: string }) => {
  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden text-white">
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 flex flex-col items-center text-center p-12 max-w-2xl mx-4"
      >
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full group-hover:bg-yellow-500/30 transition-all duration-500" />
          <div className="relative p-6 rounded-2xl bg-black/50 border border-yellow-500/30 backdrop-blur-xl">
            <Construction className="w-16 h-16 text-yellow-500" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Zone Under Construction
        </h1>

      </motion.div>
    </div>
  );
};
