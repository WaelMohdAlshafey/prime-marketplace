// @ts-nocheck
const SoftwareIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Laptop screen */}
        <rect x="3" y="4" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
        {/* Screen content - code lines */}
        <line x1="6" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6" y1="14" x2="12" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Laptop base */}
        <path d="M4 16H20L18 20H6L4 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="12" cy="18" r="1.5" fill="currentColor" opacity="0.2" />
    </svg>
);

export default SoftwareIcon;