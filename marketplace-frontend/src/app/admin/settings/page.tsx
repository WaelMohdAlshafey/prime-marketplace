'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { getStoreSettings, updateStoreSettings } from '@/lib/storeApi';
import { StoreSettings, Owner } from '@/types';
import { Save, Palette, Settings as SettingsIcon, Code, Building } from 'lucide-react';

// ✅ PRESET COLOR SCHEMES FOR EACH TEMPLATE
const templatePresets: Record<string, Partial<StoreSettings>> = {
    standard: {
        primaryColor: '#0F5C45',
        primaryDark: '#0A4735',
        primaryLight: '#1A7A5C',
        secondaryColor: '#D4A54A',
        secondaryLight: '#E8C97A',
        backgroundColor: '#F7F8FA',
        surfaceColor: '#FFFFFF',
        textColor: '#1A1A2E',
        textMuted: '#6B7280',
        navbarBg: '#0F5C45',
        navbarText: '#FFFFFF',
        navbarHover: '#D4A54A',
        footerBg: '#111827',
        footerText: '#9CA3AF',
        buttonPrimaryBg: '#0F5C45',
        buttonPrimaryHover: '#0A4735',
        buttonPrimaryText: '#FFFFFF',
        buttonSecondaryBg: '#D4A54A',
        buttonSecondaryHover: '#B8923A',
        buttonSecondaryText: '#FFFFFF',
        cardBg: '#FFFFFF',
        cardBorder: '#E5E7EB',
        cardShadow: '0 8px 32px rgba(15, 92, 69, 0.08)',
        cardHoverShadow: '0 20px 60px rgba(15, 92, 69, 0.18)',
        cardBorderRadius: '16px',
        fontFamily: "'Cairo', 'Inter', sans-serif",
        siteEmoji: '🛍️',
        faviconEmoji: '🏪',
    },
    simple: {
        primaryColor: '#4A4A4A',
        primaryDark: '#2C2C2C',
        primaryLight: '#7A7A7A',
        secondaryColor: '#7A7A7A',
        secondaryLight: '#B0B0B0',
        backgroundColor: '#F0F0F0',
        surfaceColor: '#FFFFFF',
        textColor: '#1A1A1A',
        textMuted: '#888888',
        navbarBg: '#FFFFFF',
        navbarText: '#333333',
        navbarHover: '#4A4A4A',
        footerBg: '#333333',
        footerText: '#CCCCCC',
        buttonPrimaryBg: '#4A4A4A',
        buttonPrimaryHover: '#2C2C2C',
        buttonPrimaryText: '#FFFFFF',
        buttonSecondaryBg: '#CCCCCC',
        buttonSecondaryHover: '#AAAAAA',
        buttonSecondaryText: '#333333',
        cardBg: '#FFFFFF',
        cardBorder: '#E0E0E0',
        cardShadow: '0 2px 8px rgba(0,0,0,0.06)',
        cardHoverShadow: '0 8px 24px rgba(0,0,0,0.10)',
        cardBorderRadius: '8px',
        fontFamily: "'Inter', sans-serif",
        siteEmoji: '🛒',
        faviconEmoji: '🛍️',
    },
    colored: {
        primaryColor: '#D27736',
        primaryDark: '#B05E2A',
        primaryLight: '#E8B48C',
        secondaryColor: '#F5A623',
        secondaryLight: '#FFD700',
        backgroundColor: '#FFF8F0',
        surfaceColor: '#FFFFFF',
        textColor: '#2C1810',
        textMuted: '#8A7A6A',
        navbarBg: '#D27736',
        navbarText: '#FFFFFF',
        navbarHover: '#F5A623',
        footerBg: '#2C1810',
        footerText: '#D4B8A0',
        buttonPrimaryBg: '#D27736',
        buttonPrimaryHover: '#B05E2A',
        buttonPrimaryText: '#FFFFFF',
        buttonSecondaryBg: '#F5A623',
        buttonSecondaryHover: '#D4891A',
        buttonSecondaryText: '#FFFFFF',
        cardBg: '#FFFFFF',
        cardBorder: '#E8D4C0',
        cardShadow: '0 8px 32px rgba(210, 119, 54, 0.12)',
        cardHoverShadow: '0 20px 60px rgba(210, 119, 54, 0.22)',
        cardBorderRadius: '16px',
        fontFamily: "'Cairo', sans-serif",
        siteEmoji: '🌶️',
        faviconEmoji: '🔥',
    },
    blue: {
        primaryColor: '#2563EB',
        primaryDark: '#1D4ED8',
        primaryLight: '#60A5FA',
        secondaryColor: '#3B82F6',
        secondaryLight: '#93C5FD',
        backgroundColor: '#EFF6FF',
        surfaceColor: '#FFFFFF',
        textColor: '#1E293B',
        textMuted: '#64748B',
        navbarBg: '#1E3A8A',
        navbarText: '#FFFFFF',
        navbarHover: '#60A5FA',
        footerBg: '#0F172A',
        footerText: '#94A3B8',
        buttonPrimaryBg: '#2563EB',
        buttonPrimaryHover: '#1D4ED8',
        buttonPrimaryText: '#FFFFFF',
        buttonSecondaryBg: '#3B82F6',
        buttonSecondaryHover: '#2563EB',
        buttonSecondaryText: '#FFFFFF',
        cardBg: '#FFFFFF',
        cardBorder: '#DBEAFE',
        cardShadow: '0 8px 32px rgba(37, 99, 235, 0.08)',
        cardHoverShadow: '0 20px 60px rgba(37, 99, 235, 0.18)',
        cardBorderRadius: '16px',
        fontFamily: "'Inter', sans-serif",
        siteEmoji: '💎',
        faviconEmoji: '⚡',
    },
};

export default function AdminSettings() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { template, saveTemplate, applyTheme } = useTheme();
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

    // ✅ UPDATED: Applies full preset when template changes
    const handleTemplateChange = async (newTemplate: string) => {
        if (!settings) return;

        // ✅ Get the preset for the selected template
        const preset = templatePresets[newTemplate as keyof typeof templatePresets] || {};

        // ✅ Merge the preset with current settings (keep custom fields not in preset)
        const updated = {
            ...settings,
            ...preset,
            template: newTemplate as any,
        };

        // ✅ Immediate UI update
        setSettings(updated);
        applyTheme(updated);

        try {
            await saveTemplate(newTemplate as any);
            // ✅ Sync with server – this will also call applyTheme again
            const fresh = await getStoreSettings();
            setSettings(fresh);
            applyTheme(fresh);
        } catch {
            // Revert if save fails
            const revert = await getStoreSettings();
            setSettings(revert);
            applyTheme(revert);
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

    if (loading || isLoading) {
        return <div className="text-center py-12">جاري التحميل...</div>;
    }

    if (!settings) {
        return <div className="text-center py-12 text-red-600">فشل تحميل الإعدادات.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#0F5C45]/10 rounded-xl">
                    <SettingsIcon className="w-7 h-7 text-[#0F5C45]" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">إعدادات الموقع</h1>
            </div>

            {message && (
                <div className={`p-3 rounded-lg mb-4 ${message.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setActiveTab('basic')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeTab === 'basic' ? 'bg-[#0F5C45] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <Building className="w-4 h-4" />
                    معلومات أساسية
                </button>
                <button
                    onClick={() => setActiveTab('theme')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeTab === 'theme' ? 'bg-[#0F5C45] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <Palette className="w-4 h-4" />
                    تخصيص المظهر
                </button>
                <button
                    onClick={() => setActiveTab('advanced')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeTab === 'advanced' ? 'bg-[#0F5C45] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <Code className="w-4 h-4" />
                    متقدم
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">

                {/* TAB 1: BASIC INFO */}
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

                        {/* ✅ Template Selector with Presets */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">القالب</label>
                            <select
                                key={settings.template}
                                value={settings.template || 'standard'}
                                onChange={(e) => handleTemplateChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                            >
                                <option value="standard">قياسي (أخضر)</option>
                                <option value="simple">بسيط (رمادي)</option>
                                <option value="colored">ملون (برتقالي)</option>
                                <option value="blue">أزرق</option>
                            </select>
                            <p className="text-xs text-gray-400 mt-1">يتغير التصميم فوراً عند التحديد</p>
                        </div>
                    </div>
                )}

                {/* TAB 2: THEME (same as before – manual color overrides) */}
                {activeTab === 'theme' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اللون الأساسي</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                                        value={settings.primaryColor || '#0F5C45'}
                                        onChange={(e) => updateField('primaryColor', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                        value={settings.primaryColor || ''}
                                        onChange={(e) => updateField('primaryColor', e.target.value)}
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
                                        onChange={(e) => updateField('secondaryColor', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                        value={settings.secondaryColor || ''}
                                        onChange={(e) => updateField('secondaryColor', e.target.value)}
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
                                        onChange={(e) => updateField('backgroundColor', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                        value={settings.backgroundColor || ''}
                                        onChange={(e) => updateField('backgroundColor', e.target.value)}
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
                                        onChange={(e) => updateField('textColor', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C45]"
                                        value={settings.textColor || ''}
                                        onChange={(e) => updateField('textColor', e.target.value)}
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

                {/* TAB 3: ADVANCED */}
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
                    className="w-full mt-6 py-3 bg-[#0F5C45] text-white font-semibold rounded-lg hover:bg-[#0A4735] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                </button>
            </form>
        </div>
    );
}