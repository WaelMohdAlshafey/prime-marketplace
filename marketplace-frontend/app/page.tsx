import { Suspense } from 'react';
import HomeContent from './HomeContent';

// ============================================================
// Force dynamic rendering to avoid prerender issues with useSearchParams
// ============================================================
export const dynamic = 'force-dynamic';

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