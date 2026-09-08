// @ts-nocheck
const AccessoriesIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Diamond shape */}
        <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Diamond facets */}
        <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        {/* Sparkle */}
        <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.5" />
        <circle cx="7" cy="7" r="0.5" fill="currentColor" opacity="0.3" />
        <circle cx="17" cy="17" r="0.5" fill="currentColor" opacity="0.3" />
    </svg>
);

export default AccessoriesIcon;