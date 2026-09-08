// @ts-nocheck
const PerfumeIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Diamond cap */}
        <path d="M11 2L12 0L13 2L12 4L11 2Z" fill="#D4A54A" stroke="#D4A54A" strokeWidth="0.5" />
        {/* Bottle neck */}
        <rect x="10" y="4" width="4" height="3" rx="0.5" fill="#E8D5C4" stroke="#D4A54A" strokeWidth="0.5" />
        {/* Bottle body */}
        <path d="M7 7C7 7 6.5 12 7 15C7.5 18 10 19 12 19C14 19 16.5 18 17 15C17.5 12 17 7 17 7H7Z"
            fill="#F5E6D3" stroke="#D4A54A" strokeWidth="0.8" />
        {/* Golden liquid */}
        <path d="M8.5 10C8.5 10 8.5 14 10 15.5C11 16.5 13 16.5 14 15.5C15.5 14 15.5 10 15.5 10H8.5Z"
            fill="#D4A54A" opacity="0.6" />
        {/* Decorative lines */}
        <line x1="9" y1="8" x2="15" y2="8" stroke="#D4A54A" strokeWidth="0.5" opacity="0.4" />
        <line x1="9.5" y1="12" x2="14.5" y2="12" stroke="#D4A54A" strokeWidth="0.5" opacity="0.4" />
        {/* Sparkle accents */}
        <circle cx="12" cy="8" r="0.8" fill="#FFFFFF" opacity="0.8" />
        <circle cx="10.5" cy="10" r="0.5" fill="#FFFFFF" opacity="0.5" />
        <circle cx="13.5" cy="10" r="0.5" fill="#FFFFFF" opacity="0.5" />
    </svg>
);

export default PerfumeIcon;