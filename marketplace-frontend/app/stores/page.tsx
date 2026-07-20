'use client';

import Link from 'next/link';

// The 5 vendors we inserted into the database
const vendors = [
    { id: 1, name: 'متجر البرمجيات', description: 'أفضل البرامج والتطبيقات', icon: '💻' },
    { id: 2, name: 'متجر التجميل', description: 'العناية بالشعر والبشرة', icon: '✨' },
    { id: 3, name: 'متجر الأزياء', description: 'أحدث صيحات الموضة', icon: '👗' },
    { id: 4, name: 'متجر الإلكترونيات', description: 'أجهزة وإلكترونيات حديثة', icon: '📱' },
    { id: 5, name: 'متجر المنزل', description: 'أدوات ومستلزمات المنزل', icon: '🏠' },
];

export default function StoresPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">🏪 المتاجر</h1>
            <p className="text-gray-600 text-center mb-12">تسوق من أفضل المتاجر الموثوقة في Prime</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                    <div
                        key={vendor.id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 text-center hover:-translate-y-2 border border-gray-50 group"
                    >
                        <div className="text-6xl mb-4 group-hover:scale-110 transition">{vendor.icon}</div>
                        <h3 className="text-2xl font-bold text-gray-800">{vendor.name}</h3>
                        <p className="text-gray-500 mt-2">{vendor.description}</p>
                        <Link
                            href={`/vendors/${vendor.id}`}
                            className="mt-4 inline-block bg-[#0F5C45] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#0A4735] transition"
                        >
                            زيارة المتجر ←
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}