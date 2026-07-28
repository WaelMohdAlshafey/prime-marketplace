'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
                whileHover={{ rotate: -10, scale: 1.05 }}
                className="relative"
            >
                <div className="w-11 h-11 bg-gradient-to-br from-[#0F5C45] to-[#1A7A5C] rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 7V12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            </motion.div>
            <motion.span
                whileHover={{ scale: 1.02 }}
                className="text-2xl font-bold text-[#0F5C45] tracking-tight"
            >
                Prime
            </motion.span>
        </Link>
    );
}