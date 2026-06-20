"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { CloudRain, Github } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/80 to-transparent pb-4 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between pointer-events-auto overflow-hidden">
        
        {/* Left Side (File-Share) */}
        <motion.div
          variants={{
            visible: { x: 0, opacity: 1 },
            hidden: { x: "-100%", opacity: 0 },
          }}
          animate={hidden ? "hidden" : "visible"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground transition-transform group-hover:scale-105 shadow-md">
              <CloudRain size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight transition-colors group-hover:text-primary drop-shadow-sm">File-Share</span>
          </Link>
        </motion.div>
        
        {/* Right Side (GitHub) */}
        <motion.div
          variants={{
            visible: { x: 0, opacity: 1 },
            hidden: { x: "100%", opacity: 0 },
          }}
          animate={hidden ? "hidden" : "visible"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex gap-4"
        >
          <Link href="https://github.com/zxsharp/file-share" target="_blank" rel="noreferrer">
            <Button variant="ghost" className="relative group overflow-hidden bg-transparent gap-2 transition-all hover:bg-transparent">
              <Github className="w-5 h-5 relative z-10 transition-colors group-hover:text-primary" />
              <span className="relative z-10 font-medium transition-colors group-hover:text-primary">GitHub</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </nav>
  )
}
