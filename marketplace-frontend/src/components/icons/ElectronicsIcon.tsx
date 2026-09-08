// @ts-nocheck
const ElectronicsIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Smartphone body */}
        <rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        {/* Screen */}
        <rect x="8" y="6" width="8" height="11" rx="1" fill="currentColor" opacity="0.15" />
        {/* Screen content */}
        <line x1="10" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="10" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <line x1="10" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        {/* Home button */}
        <circle cx="12" cy="19.5" r="1" fill="currentColor" opacity="0.3" />
        {/* Camera */}
        <circle cx="12" cy="4.5" r="0.8" fill="currentColor" opacity="0.4" />
    </svg>
);

export default ElectronicsIcon;