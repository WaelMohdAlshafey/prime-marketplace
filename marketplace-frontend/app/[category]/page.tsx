import CategoryPage from '@/components/CategoryPage';

// ============================================================
// Dynamic route for categories
// ============================================================

export default function CategoryRoute({ params }: { params: { category: string } }) {
    const category = Array.isArray(params.category) ? params.category[0] : params.category;
    console.log('🏷️ CategoryRoute rendering for:', category);
    return <CategoryPage category={category} />;
}

// ============================================================
// STATIC SITE GENERATION + INCREMENTAL STATIC REGENERATION
// ============================================================

// Generate static pages for all categories at build time
export async function generateStaticParams() {
    try {
        const response = await fetch('https://prime-marketplace-8hut.onrender.com/api/Categories');
        const categories: string[] = await response.json();

        return categories.map((category) => ({
            category: category,
        }));
    } catch (error) {
        console.error('Failed to generate static params for categories:', error);
        return [];
    }
}

// Revalidate every hour (3600 seconds)
// This allows pages to be regenerated if categories change
export const revalidate = 3600;