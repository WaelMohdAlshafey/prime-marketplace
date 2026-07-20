import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
                    {/* Company */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4 justify-end">
                            <div className="w-10 h-10 bg-[#0F5C45] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                P
                            </div>
                            <span className="text-xl font-bold text-white">Prime</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            منصة تسوق فاخرة تقدم أفضل المنتجات من برامج، تجميل، أزياء، وإكسسوارات.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">روابط سريعة</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/" className="hover:text-white transition">الرئيسية</Link></li>
                            <li><Link href="/products" className="hover:text-white transition">المنتجات</Link></li>
                            <li><Link href="/stores" className="hover:text-white transition">المتاجر</Link></li>
                            <li><Link href="/offers" className="hover:text-white transition">العروض</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">خدمة العملاء</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/contact" className="hover:text-white transition">اتصل بنا</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition">الأسئلة الشائعة</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition">سياسة الإرجاع</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition">الشحن والتوصيل</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">النشرة البريدية</h4>
                        <p className="text-gray-400 text-sm mb-3">
                            اشترك لتحصل على أحدث العروض والمنتجات.
                        </p>
                        <div className="flex flex-row-reverse">
                            <input
                                type="email"
                                placeholder="بريدك الإلكتروني"
                                className="flex-1 px-3 py-2 rounded-l-none rounded-r-lg text-gray-900 text-sm focus:outline-none"
                            />
                            <button className="bg-[#0F5C45] px-4 py-2 rounded-l-lg rounded-r-none text-sm font-medium hover:bg-[#0A4735] transition">
                                اشتراك
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-xs">
                    © 2024 Prime. جميع الحقوق محفوظة.
                </div>
            </div>
        </footer>
    );
}