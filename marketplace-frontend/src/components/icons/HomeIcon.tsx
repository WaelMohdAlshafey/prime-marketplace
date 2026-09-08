// @ts-nocheck
const HomeIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* House roof */}
        <path d="M2 10L12 3L22 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* House body */}
        <rect x="5" y="10" width="14" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
        {/* Door */}
        <rect x="9" y="14" width="6" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        {/* Door handle */}
        <circle cx="13.5" cy="17.5" r="0.5" fill="currentColor" opacity="0.5" />
        {/* Window */}
        <circle cx="8" cy="12" r="1" fill="currentColor" opacity="0.3" />
        <circle cx="16" cy="12" r="1" fill="currentColor" opacity="0.3" />
        {/* Chimney */}
        <rect x="16" y="4" width="3" height="5" fill="currentColor" opacity="0.2" />
    </svg>
);

export default HomeIcon;