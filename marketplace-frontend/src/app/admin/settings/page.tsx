'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getStoreSettings, updateStoreSettings } from '@/lib/storeApi';
import { StoreSettings, Owner } from '@/types';
import { useTheme } from '@/context/ThemeContext';

export default function AdminSettings() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { applyTheme } = useTheme();
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'basic' | 'theme' | 'advanced'>('basic');

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.push('/auth/login');
            return;
        }
        if (user.role !== 'Admin') {
            router.push('/');
            return;
        }

        getStoreSettings()
            .then(setSettings)
            .finally(() => setLoading(false));
    }, [user, isLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        setMessage('');
        try {
            const updated = await updateStoreSettings(settings);
            setSettings(updated);
            applyTheme(updated);
            setMessage('✅ Settings updated successfully!');
        } catch (error) {
            setMessage('❌ Failed to update settings. Please try again.');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const updateField = <K extends keyof StoreSettings>(field: K, value: StoreSettings[K]) => {
        setSettings(prev => prev ? { ...prev, [field]: value } : null);
    };

    const updateOwners = (value: string) => {
        const names = value.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name }));
        setSettings(prev => prev ? { ...prev, owners: names } : null);
    };

    const updateMobileNumbers = (value: string) => {
        const numbers = value.split(',').map(s => s.trim()).filter(Boolean);
        setSettings(prev => prev ? { ...prev, mobileNumbers: numbers } : null);
    };

    const updateEmails = (value: string) => {
        const emails = value.split(',').map(s => s.trim()).filter(Boolean);
        setSettings(prev => prev ? { ...prev, emails } : null);
    };

    const updateThemeColor = (field: keyof StoreSettings, value: string) => {
        // Handle hex color input
        if (value.startsWith('#')) {
            updateField(field, value);
        } else {
            // If user types a color name or invalid, just store it as-is
            updateField(field, value);
        }
    };

    if (loading || isLoading) {
        return <div className="text-center py-12">جاري التحميل...</div>;
    }

    if (!settings) {
        return <div className="text-center py-12 text-red-600">فشل تحميل الإعدادات.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">⚙️ إعدادات الموقع</h1>

            {message && (
                <div className={`p-3 rounded-lg mb-4 ${message.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setActiveTab('basic')}
                    className={`px-4 py-2 rounded-lg transition ${activeTab === 'basic' ? 'bg-[#0F5C45] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    📋 معلومات أساسية
                </button>
                <button
                    onClick={() => setActiveTab('theme')}
                    className={`px-4 py-2 rounded-lg transition ${activeTab === 'theme' ? 'bg-[#0F5C45] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    🎨 تخصيص المظهر
                </button>
                <button
                    onClick={() => setActiveTab('advanced')}
                    className={`px-4 py-2 rounded-lg transition ${activeTab === 'advanced' ? 'bg-[#0F5C45] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    ⚡ متقدم
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">

                {/* ============================================================
                    TAB 1: BASIC INFO
                    ============================================================ */}
                {activeTab === 'basic' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                value={settings.storeName}
                                onChange={(e) => updateField('storeName', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                value={settings.address}
                                onChange={(e) => updateField('address', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الموقع</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                value={settings.location}
                                onChange={(e) => updateField('location', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">المالكين (مفصولة بفواصل)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                value={settings.owners.map(o => o.name).join(', ')}
                                onChange={(e) => updateOwners(e.target.value)}
                                placeholder="أحمد، سارة، يوسف، منى"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">أرقام المحافظ (مفصولة بفواصل)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                value={settings.mobileNumbers.join(', ')}
                                onChange={(e) => updateMobileNumbers(e.target.value)}
                                placeholder="+20 100 123 4567, +20 101 234 5678"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني (مفصول بفواصل)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                value={settings.emails.join(', ')}
                                onChange={(e) => updateEmails(e.target.value)}
                                placeholder="support@primemarket.com, info@primemarket.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف الأرضي</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                value={settings.landline}
                                onChange={(e) => updateField('landline', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">واتساب</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                value={settings.whatsapp}
                                onChange={(e) => updateField('whatsapp', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">القالب</label>
                            <select
                                value={settings.template}
                                onChange={(e) => updateField('template', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                            >
                                <option value="standard">قياسي</option>
                                <option value="simple">بسيط (رمادي)</option>
                                <option value="colored">ملون (برتقالي)</option>
                                <option value="blue">أزرق</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* ============================================================
                    TAB 2: THEME CUSTOMIZATION
                    ============================================================ */}
                {activeTab === 'theme' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Colors */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اللون الأساسي</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                                        value={settings.primaryColor || '#0F5C45'}
                                        onChange={(e) => updateThemeColor('primaryColor', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                        value={settings.primaryColor || ''}
                                        onChange={(e) => updateThemeColor('primaryColor', e.target.value)}
                                        placeholder="#0F5C45"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اللون الثانوي</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                                        value={settings.secondaryColor || '#D4A54A'}
                                        onChange={(e) => updateThemeColor('secondaryColor', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                        value={settings.secondaryColor || ''}
                                        onChange={(e) => updateThemeColor('secondaryColor', e.target.value)}
                                        placeholder="#D4A54A"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">لون الخلفية</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                                        value={settings.backgroundColor || '#F7F8FA'}
                                        onChange={(e) => updateThemeColor('backgroundColor', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                        value={settings.backgroundColor || ''}
                                        onChange={(e) => updateThemeColor('backgroundColor', e.target.value)}
                                        placeholder="#F7F8FA"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">لون النص</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                                        value={settings.textColor || '#1A1A2E'}
                                        onChange={(e) => updateThemeColor('textColor', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                        value={settings.textColor || ''}
                                        onChange={(e) => updateThemeColor('textColor', e.target.value)}
                                        placeholder="#1A1A2E"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="my-4 border-gray-200" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">خلفية شريط التنقل</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                    value={settings.navbarBg || ''}
                                    onChange={(e) => updateField('navbarBg', e.target.value)}
                                    placeholder="#0F5C45"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نص شريط التنقل</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                    value={settings.navbarText || ''}
                                    onChange={(e) => updateField('navbarText', e.target.value)}
                                    placeholder="#FFFFFF"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">خلفية التذييل</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                    value={settings.footerBg || ''}
                                    onChange={(e) => updateField('footerBg', e.target.value)}
                                    placeholder="#111827"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نص التذييل</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                    value={settings.footerText || ''}
                                    onChange={(e) => updateField('footerText', e.target.value)}
                                    placeholder="#9CA3AF"
                                />
                            </div>
                        </div>

                        <hr className="my-4 border-gray-200" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">لون خلفية البطاقة</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                    value={settings.cardBg || ''}
                                    onChange={(e) => updateField('cardBg', e.target.value)}
                                    placeholder="#FFFFFF"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">حد البطاقة</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                    value={settings.cardBorder || ''}
                                    onChange={(e) => updateField('cardBorder', e.target.value)}
                                    placeholder="#E5E7EB"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ظل البطاقة</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                    value={settings.cardShadow || ''}
                                    onChange={(e) => updateField('cardShadow', e.target.value)}
                                    placeholder="0 8px 32px rgba(15, 92, 69, 0.08)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نصف قطر البطاقة</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                    value={settings.cardBorderRadius || ''}
                                    onChange={(e) => updateField('cardBorderRadius', e.target.value)}
                                    placeholder="16px"
                                />
                            </div>
                        </div>

                        <hr className="my-4 border-gray-200" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">أيقونة الموقع (إيموجي)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                    value={settings.siteEmoji || ''}
                                    onChange={(e) => updateField('siteEmoji', e.target.value)}
                                    placeholder="🛍️"
                                    maxLength={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">خط الموقع</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                    value={settings.fontFamily || ''}
                                    onChange={(e) => updateField('fontFamily', e.target.value)}
                                    placeholder="Cairo, 'Inter', sans-serif"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================================
                    TAB 3: ADVANCED
                    ============================================================ */}
                {activeTab === 'advanced' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CSS مخصص</label>
                            <textarea
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] font-mono text-sm"
                                value={settings.customCss || ''}
                                onChange={(e) => updateField('customCss', e.target.value)}
                                placeholder="/* أضف CSS مخصص هنا */"
                            />
                            <p className="text-xs text-gray-400 mt-1">سيتم إضافة هذا الـ CSS إلى رأس الموقع. استخدم بحذر.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">HTML مخصص للرأس</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] font-mono text-sm"
                                value={settings.customHeaderHtml || ''}
                                onChange={(e) => updateField('customHeaderHtml', e.target.value)}
                                placeholder="<!-- إضافة HTML إلى الرأس -->"
                            />
                            <p className="text-xs text-gray-400 mt-1">سيتم إضافته داخل علامة &lt;head&gt;.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">HTML مخصص للتذييل</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45] font-mono text-sm"
                                value={settings.customFooterHtml || ''}
                                onChange={(e) => updateField('customFooterHtml', e.target.value)}
                                placeholder="<!-- إضافة HTML إلى التذييل -->"
                            />
                            <p className="text-xs text-gray-400 mt-1">سيتم إضافته قبل إغلاق &lt;body&gt;.</p>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full mt-6 py-3 bg-[#0F5C45] text-white font-semibold rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50"
                >
                    {saving ? 'جاري الحفظ...' : '💾 حفظ الإعدادات'}
                </button>
            </form>
        </div>
    );
}/ /   f o r c e   r e d e p l o y  
 