"use client";

import { motion } from "framer-motion";
import { Monitor, Cloud, Smartphone, FileUp, FileDown, RefreshCw } from "lucide-react";
import { GridPattern } from "./grid-pattern";

import { type ElementType } from "react";

interface IconBlockProps {
  icon: ElementType;
  label: string;
  className?: string;
  iconClass?: string;
  borderHoverClass?: string;
}

const IconBlock = ({ icon: Icon, label, className, iconClass, borderHoverClass }: IconBlockProps) => (
  <div className={`absolute group flex flex-col items-center justify-center z-10 ${className}`}>
    <div className={`relative bg-card p-4 sm:p-5 rounded-2xl border-2 shadow-xl transition-all duration-300 group-hover:scale-110 cursor-default ${borderHoverClass}`}>
      <Icon className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${iconClass}`} />
    </div>
    <span className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold bg-popover text-popover-foreground px-3 py-1 rounded-md border shadow-lg pointer-events-none whitespace-nowrap z-50">
      {label}
    </span>
  </div>
);

export function Hero() {
  return (
    <GridPattern className="pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
        
        {/* Left: Text Content */}
        <div className="flex-1 text-center md:text-left space-y-6 z-10 relative">
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            Share Files <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Without Login
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0"
          >
            Upload your files securely to the cloud and share them instantly with anyone. No need to create an account.
          </motion.p>
        </div>

        {/* Right: Animated Diagram */}
        <div className="flex-1 w-full max-w-md relative flex items-center justify-center h-[300px] z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            
            {/* Horizontal Path line */}
            <div className="absolute top-[50%] left-[15%] right-[15%] h-1 -translate-y-1/2 bg-gradient-to-r from-primary/30 via-blue-500/30 to-primary/30 rounded-full" />

            {/* Nodes */}
            <IconBlock 
              icon={Monitor} 
              label="Sender" 
              className="left-[5%] top-[50%] -translate-y-1/2" 
              iconClass="text-primary"
              borderHoverClass="group-hover:border-primary/50 group-hover:shadow-primary/20"
            />
            
            <IconBlock 
              icon={Smartphone} 
              label="Receiver" 
              className="right-[5%] top-[50%] -translate-y-1/2" 
              iconClass="text-primary"
              borderHoverClass="group-hover:border-primary/50 group-hover:shadow-primary/20"
            />

            {/* Cloud Node with integrated Cron */}
            <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center justify-center z-10">
              <div className="relative bg-card p-4 sm:p-5 rounded-2xl border-2 shadow-xl transition-all duration-300 group-hover:scale-110 cursor-default group-hover:border-blue-500/50 group-hover:shadow-blue-500/20">
                <Cloud className="w-8 h-8 sm:w-10 sm:h-10 transition-colors text-blue-500" />
                
                {/* Integrated Cron Auto-Delete Badge */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-3 -right-3 bg-background border shadow-sm rounded-full p-1.5 flex items-center justify-center text-destructive"
                >
                  <RefreshCw className="w-4 h-4 sm:w-4 sm:h-4" />
                </motion.div>
              </div>
              <span className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold bg-popover text-popover-foreground px-3 py-1 rounded-md border shadow-lg pointer-events-none whitespace-nowrap z-50">
                Cloud (Auto-Deletes)
              </span>
            </div>

            {/* Moving File (Upload) */}
            <motion.div
              animate={{ 
                left: ["15%", "50%"],
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1, 1, 0.8]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[50%] -translate-y-1/2 -translate-x-1/2 bg-card border-2 p-2 rounded-xl shadow-lg z-20 flex items-center justify-center text-primary"
            >
              <FileUp className="w-5 h-5" />
            </motion.div>

            {/* Moving File (Download) */}
            <motion.div
              animate={{ 
                left: ["50%", "85%"],
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1, 1, 0.8]
              }}
              transition={{ 
                duration: 2.5, 
                delay: 1.25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[50%] -translate-y-1/2 -translate-x-1/2 bg-card border-2 p-2 rounded-xl shadow-lg z-20 flex items-center justify-center text-blue-500"
            >
              <FileDown className="w-5 h-5" />
            </motion.div>

          </motion.div>
        </div>

      </div>
    </GridPattern>
  )
}
