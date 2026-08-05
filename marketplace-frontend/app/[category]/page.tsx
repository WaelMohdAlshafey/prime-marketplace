// src/app/[category]/page.tsx
import CategoryPage from '@/components/CategoryPage';

// This is a Next.js dynamic route for categories
// It receives the category slug from the URL (e.g., 'software', 'hair-care')
export default function CategoryRoute({ params }: { params: { category: string } }) {
    // Ensure we have a single string (not array)
    const category = Array.isArray(params.category) ? params.category[0] : params.category;

    console.log('🏷️ CategoryRoute rendering for:', category);

    return <CategoryPage category={category} />;
}

// Optional: Generate static params for all categories if you want SSG
// But for now, we keep it as SSR (Server-Side Rendering)