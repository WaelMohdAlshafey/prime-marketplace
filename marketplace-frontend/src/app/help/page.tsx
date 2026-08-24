'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function HelpPage() {
    const { t, i18n } = useTranslation('common');
    const [activeTab, setActiveTab] = useState('customer');
    const lang = i18n.language || 'ar';

    const tabs = [
        { id: 'customer', label: t('helpCustomer'), icon: '👤' },
        { id: 'vendor', label: t('helpVendor'), icon: '🏪' },
        { id: 'employee', label: t('helpEmployee'), icon: '👔' },
        { id: 'admin', label: t('helpAdmin'), icon: '⚙️' },
    ];

    const content: Record<string, { title: string; sections: { title: string; steps: string[] }[] }> = {
        customer: {
            title: lang === 'ar' ? '👤 العميل – كيفية التسوق وإدارة حسابك' : '👤 Customer – How to Shop & Manage Your Account',
            sections: [
                {
                    title: lang === 'ar' ? '🚀 البدء' : '🚀 Getting Started',
                    steps: lang === 'ar'
                        ? ['1️⃣ اضغط على "إنشاء حساب" وأدخل بياناتك.', '2️⃣ استخدم بريدك الإلكتروني وكلمة المرور لتسجيل الدخول.', '3️⃣ استعرض المنتجات والفئات من الصفحة الرئيسية.']
                        : ['1️⃣ Click "Create Account" and fill in your details.', '2️⃣ Use your email and password to login.', '3️⃣ Browse products and categories from the homepage.']
                },
                {
                    title: lang === 'ar' ? '🔍 التصفح والبحث' : '🔍 Browsing & Searching',
                    steps: lang === 'ar'
                        ? ['استخدم القائمة العلوية للتنقل بين الفئات.', 'انقر على أي بطاقة فئة لعرض المنتجات.', 'استخدم شريط البحث للعثور على منتج معين.', 'طبق الفلاتر (السعر، التقييم، المخزون) من القائمة الجانبية.']
                        : ['Use the top menu to navigate categories.', 'Click a category card to view products.', 'Use the search bar to find a specific product.', 'Apply filters (price, rating, stock) from the sidebar.']
                },
                {
                    title: lang === 'ar' ? '🛍️ تفاصيل المنتج والشراء' : '🛍️ Product Details & Purchase',
                    steps: lang === 'ar'
                        ? ['انقر على أي بطاقة منتج لفتح التفاصيل.', 'تحقق من السعر والمخزون والوصف.', 'اختر الكمية وانقر "إضافة إلى السلة".', 'اذهب إلى السلة وأكمل الطلب.']
                        : ['Click any product card to open details.', 'Check price, stock, and description.', 'Choose quantity and click "Add to Cart".', 'Go to Cart and complete your order.']
                },
                {
                    title: lang === 'ar' ? '📦 الطلبات والتتبع' : '📦 Orders & Tracking',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "طلباتي" لمشاهدة جميع الطلبات.', 'انقر "عرض الفاتورة" للتفاصيل.', 'استخدم "تتبع الطلب" لمتابعة الشحن.', 'يمكنك إلغاء الطلبات المعلقة أو المدفوعة قبل الشحن.']
                        : ['Go to "My Orders" to see all orders.', 'Click "View Invoice" for details.', 'Use "Track Order" to follow shipment.', 'You can cancel pending or paid orders before shipping.']
                },
                {
                    title: lang === 'ar' ? '❤️ المفضلة والسلة' : '❤️ Wishlist & Cart',
                    steps: lang === 'ar'
                        ? ['انقر على القلب لإضافة المنتج إلى المفضلة.', 'شاهد المفضلة من أيقونة القلب في الأعلى.', 'أيقونة السلة تعرض عدد العناصر.', 'في السلة، يمكنك تغيير الكميات أو حذف العناصر.']
                        : ['Click the heart to add to wishlist.', 'View wishlist from the heart icon at top.', 'Cart icon shows item count.', 'In cart, change quantities or remove items.']
                },
            ]
        },
        vendor: {
            title: lang === 'ar' ? '🏪 البائع – إدارة المنتجات والطلبات' : '🏪 Vendor – Manage Your Products & Orders',
            sections: [
                {
                    title: lang === 'ar' ? '📊 لوحة التحكم' : '📊 Dashboard',
                    steps: lang === 'ar'
                        ? ['بعد تسجيل الدخول كبائع، ستظهر لك "لوحة التحكم" في القائمة.', 'تعرض اللوحة نظرة عامة على منتجاتك.', 'يمكنك إضافة منتجات جديدة أو تعديل أو حذف المنتجات الحالية.']
                        : ['After login as Vendor, "Dashboard" appears in the menu.', 'The dashboard shows an overview of your products.', 'You can add, edit, or delete products.']
                },
                {
                    title: lang === 'ar' ? '➕ إدارة المنتجات' : '➕ Product Management',
                    steps: lang === 'ar'
                        ? ['انقر "إضافة منتج" واملأ التفاصيل (الاسم، السعر، المخزون، الصورة).', 'احفظ المنتج وسيظهر في متجرك فوراً.', 'لتعديل منتج، انقر على ✏️ بجانبه.', 'للحذف، انقر على 🗑️ وأكد الحذف.']
                        : ['Click "Add Product" and fill details (name, price, stock, image).', 'Save and the product appears in your store immediately.', 'To edit, click ✏️ next to the product.', 'To delete, click 🗑️ and confirm.']
                },
                {
                    title: lang === 'ar' ? '📋 إدارة الطلبات' : '📋 Order Management',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "Manage Orders" لمشاهدة الطلبات التي تحتوي على منتجاتك.', 'انقر "View" على أي طلب لمشاهدة التفاصيل.', 'يمكنك تحديث حالة الطلب وإضافة ملاحظات وشركة الشحن.']
                        : ['Go to "Manage Orders" to see orders containing your products.', 'Click "View" on any order for details.', 'You can update order status and add notes and carrier.']
                },
            ]
        },
        employee: {
            title: lang === 'ar' ? '👔 الموظف – معالجة الطلبات والدعم' : '👔 Employee – Order Processing & Support',
            sections: [
                {
                    title: lang === 'ar' ? '📌 نظرة عامة' : '📌 Overview',
                    steps: lang === 'ar'
                        ? ['الموظفون مسؤولون عن معالجة الطلبات وتأكيد الدفع ودعم العملاء.', 'صلاحياتهم محدودة مقارنة بالمدير.']
                        : ['Employees handle order processing, payment confirmation, and customer support.', 'They have limited permissions compared to Admin.']
                },
                {
                    title: lang === 'ar' ? '📋 إدارة الطلبات' : '📋 Managing Orders',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "Manage Orders" لمشاهدة جميع الطلبات.', 'انقر "View" لمشاهدة التفاصيل.', 'يمكنك تحديث حالة الطلب وإضافة ملاحظات وشركة الشحن.', 'يمكنك تأكيد الدفع للطلبات النقدية عند الاستلام.']
                        : ['Go to "Manage Orders" to see all orders.', 'Click "View" for details.', 'Update order status and add notes and carrier.', 'Confirm payment for Cash on Delivery orders.']
                },
            ]
        },
        admin: {
            title: lang === 'ar' ? '⚙️ المدير – التحكم الكامل والإعدادات' : '⚙️ Admin – Full Control & Configuration',
            sections: [
                {
                    title: lang === 'ar' ? '📊 لوحة التحكم' : '📊 Dashboard',
                    steps: lang === 'ar'
                        ? ['بعد تسجيل الدخول كمدير، اذهب إلى "Admin Panel".', 'تعرض اللوحة إحصائيات: المستخدمين، المنتجات، الطلبات، الإيرادات، المشتركين.', 'يوجد رسم بياني للإيرادات الشهرية وجدول للطلبات الأخيرة.']
                        : ['After login as Admin, go to "Admin Panel".', 'The dashboard shows users, products, orders, revenue, subscribers.', 'Monthly revenue chart and recent orders table are displayed.']
                },
                {
                    title: lang === 'ar' ? '👥 إدارة المستخدمين' : '👥 User Management',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "Admin → Users" لمشاهدة جميع المستخدمين.', 'يمكنك تغيير دور المستخدم (عميل، بائع، موظف، مدير).', 'يمكنك إعادة تعيين كلمة المرور أو حذف المستخدم.', 'يمكنك أيضاً إنشاء مستخدمين جدد.']
                        : ['Go to "Admin → Users" to see all users.', 'Change user role (Customer, Vendor, Employee, Admin).', 'Reset password or delete user.', 'Create new users directly.']
                },
                {
                    title: lang === 'ar' ? '📦 إدارة المنتجات' : '📦 Product Management',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "Admin → Products" لمشاهدة جميع المنتجات.', 'يمكنك إضافة أو تعديل أو حذف أي منتج.', 'يمكنك تبديل حالة المنتج (نشط/غير نشط).']
                        : ['Go to "Admin → Products" to see all products.', 'Add, edit, or delete any product.', 'Toggle product status (Active/Inactive).']
                },
                {
                    title: lang === 'ar' ? '📋 إدارة الطلبات' : '📋 Order Management',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "Admin → Orders" لمشاهدة جميع الطلبات.', 'يمكنك عرض أي طلب وتحديث حالته وإضافة رقم تتبع وشركة شحن.', 'يمكنك تأكيد الدفع أو إلغاء تأكيد الدفع (للتراجع).']
                        : ['Go to "Admin → Orders" to see all orders.', 'View, update status, add tracking number and carrier.', 'Confirm payment or revert payment (for refunds).']
                },
                {
                    title: lang === 'ar' ? '💡 اقتراحات المنتجات' : '💡 Product Suggestions',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "Admin → Suggestions" لمشاهدة جميع الاقتراحات.', 'انقر "View" لمشاهدة التفاصيل.', 'يمكنك "Approve" (ينشئ المنتج) أو "Reject" مع إضافة ملاحظة.']
                        : ['Go to "Admin → Suggestions" to see all suggestions.', 'Click "View" for details.', 'Approve (creates the product) or Reject with a note.']
                },
                {
                    title: lang === 'ar' ? '🏬 إدارة المتاجر' : '🏬 Store Management',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "Admin → Stores" لمشاهدة جميع المتاجر.', 'يمكنك إنشاء متجر جديد لبائع.', 'يمكنك تعديل تفاصيل المتجر أو تبديل الحالة أو حذفه.']
                        : ['Go to "Admin → Stores" to see all stores.', 'Create a new store for a vendor.', 'Edit store details, toggle status, or delete.']
                },
                {
                    title: lang === 'ar' ? '📧 إدارة النشرة البريدية' : '📧 Newsletter Management',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "Admin → Newsletter" لمشاهدة جميع المشتركين.', 'يمكنك تصدير القائمة بصيغة CSV.', 'يمكنك إلغاء اشتراك أي بريد إلكتروني.']
                        : ['Go to "Admin → Newsletter" to see all subscribers.', 'Export the list as CSV.', 'Unsubscribe any email.']
                },
                {
                    title: lang === 'ar' ? '📈 التحليلات' : '📈 Analytics',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "Admin → Analytics" لمشاهدة الرسوم البيانية.', 'الرسوم تشمل: المستخدمين حسب الدور، الطلبات حسب الحالة، الإيرادات الشهرية.']
                        : ['Go to "Admin → Analytics" to view charts.', 'Charts include: Users by Role, Orders by Status, Monthly Revenue.']
                },
                {
                    title: lang === 'ar' ? '🔗 الروابط الذهبية (تسجيل الدخول السحري)' : '🔗 Golden Links (Magic Login)',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "Admin → Golden Links" لإنشاء روابط دخول لأي مستخدم.', 'اختر مستخدم، حدد صلاحية (أيام)، ومسار إعادة التوجيه.', 'انسخ الرابط وأرسله للمستخدم.', 'الروابط قابلة لإعادة الاستخدام حتى انتهاء الصلاحية.']
                        : ['Go to "Admin → Golden Links" to create login links for any user.', 'Select a user, set expiry (days), and redirect path.', 'Copy and share the link.', 'Links are reusable until expiry.']
                },
                {
                    title: lang === 'ar' ? '⚙️ إعدادات الموقع (المظهر والشركة)' : '⚙️ Site Settings (Theme & Company)',
                    steps: lang === 'ar'
                        ? ['اذهب إلى "Admin → Settings" لتكوين المتجر.', 'تحت "معلومات أساسية": تحديث اسم المتجر، العنوان، المالكين، جهات الاتصال.', 'اختر قالباً (قياسي، بسيط، ملون، أزرق) لتغيير المظهر بالكامل.', 'تحت "تخصيص المظهر": تغيير الألوان الفردية يدوياً (أساسي، ثانوي، خلفية، نصوص، شريط التنقل، التذييل).', 'تحت "متقدم": إضافة CSS مخصص أو HTML مخصص.', 'انقر "حفظ الإعدادات" لتطبيق التغييرات.']
                        : ['Go to "Admin → Settings" to configure your store.', 'Under "معلومات أساسية": update store name, address, owners, contacts.', 'Choose a template (standard, simple, colored, blue) to change the entire look.', 'Under "تخصيص المظهر": manually override individual colors.', 'Under "متقدم": add custom CSS or custom HTML.', 'Click "حفظ الإعدادات" to apply changes.']
                },
            ]
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-primary border-b-4 border-primary pb-3 mb-6">
                {t('helpTitle')}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-3">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2 rounded-full font-semibold transition ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-2xl font-bold text-text mb-4">
                    {content[activeTab]?.title || 'Loading...'}
                </h2>

                {content[activeTab]?.sections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                        <h3 className="text-lg font-semibold text-primary mb-2">{section.title}</h3>
                        <ul className="list-disc list-inside space-y-1 text-text-muted">
                            {section.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ul>
                    </div>
                ))}

                {(!content[activeTab]?.sections || content[activeTab]?.sections.length === 0) && (
                    <p className="text-text-muted">{lang === 'ar' ? 'جاري تحميل المحتوى...' : 'Loading content...'}</p>
                )}
            </div>
        </div>
    );
}