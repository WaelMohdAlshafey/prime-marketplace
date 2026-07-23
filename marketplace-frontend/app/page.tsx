import { Suspense } from 'react';
import HomeContent from './HomeContent';

// ============================================================
// FORCE DYNAMIC RENDERING - This prevents prerender errors
// with useSearchParams on Vercel
// ============================================================
export const dynamic = 'force-dynamic';

// ============================================================
// Server Component that receives searchParams as a prop
// ============================================================
export default function HomePage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams?.q || '';

    return (
        <Suspense fallback={<div className="text-center py-12">جاري التحميل...</div>}>
            <HomeContent initialQuery={query} />
        </Suspense>
    );
}