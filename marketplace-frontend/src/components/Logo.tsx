import Link from 'next/link';
import { motion } from 'framer-motion';

interface LogoProps {
    className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
            <motion.div whileHover={{ rotate: -5, scale: 1.05 }} className="relative">
                <div className="w-10 h-10 bg-[#4E8C9E] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 7V12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            </motion.div>
            <motion.span whileHover={{ scale: 1.02 }} className="text-2xl font-bold text-black tracking-tight">
                Prime
            </motion.span>
        </Link>
    );
}