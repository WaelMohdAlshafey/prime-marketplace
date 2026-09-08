// @ts-nocheck
const SupplementsIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pill/capsule shape */}
        <rect x="8" y="8" width="8" height="12" rx="4" stroke="currentColor" strokeWidth="1.5" />
        {/* Capsule split */}
        <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        {/* Second pill */}
        <rect x="13" y="3" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        {/* Heart accent */}
        <path d="M15 18C15 18 14 17 13 18C12 19 15 21 15 21C15 21 18 19 17 18C16 17 15 18 15 18Z"
            fill="currentColor" opacity="0.4" />
    </svg>
);

export default SupplementsIcon;