// @ts-nocheck
const HairCareIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hair waves */}
        <path d="M4 10C4 10 6 6 8 8C10 10 12 6 14 8C16 10 18 6 20 8"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 14C4 14 6 10 8 12C10 14 12 10 14 12C16 14 18 10 20 12"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 18C4 18 6 14 8 16C10 18 12 14 14 16C16 18 18 14 20 16"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Sparkle accent */}
        <circle cx="12" cy="5" r="1" fill="currentColor" opacity="0.6" />
        <circle cx="8" cy="7" r="0.6" fill="currentColor" opacity="0.4" />
        <circle cx="16" cy="7" r="0.6" fill="currentColor" opacity="0.4" />
    </svg>
);

export default HairCareIcon;