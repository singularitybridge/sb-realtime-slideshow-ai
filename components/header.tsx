"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full sticky top-0 z-50 border-b bg-background"
    >
      <div className="h-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
      <div className="container mx-auto px-4 py-2 flex justify-end">
        <Link href="/dev-portal">
          <Button variant="ghost" size="sm" className="gap-2">
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">Developer Portal</span>
          </Button>
        </Link>
      </div>
    </motion.header>
  );
}
