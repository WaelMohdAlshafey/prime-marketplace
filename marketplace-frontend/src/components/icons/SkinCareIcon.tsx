// @ts-nocheck
const SkinCareIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Droplet shape */}
        <path d="M12 2C12 2 6 10 6 15C6 18.5 9 21 12 21C15 21 18 18.5 18 15C18 10 12 2 12 2Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Droplet shine */}
        <circle cx="10" cy="12" r="1" fill="currentColor" opacity="0.6" />
        <circle cx="13" cy="8" r="0.6" fill="currentColor" opacity="0.4" />
        {/* Leaf accent */}
        <path d="M18 15L21 13L19 16L21 19L18 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default SkinCareIcon;