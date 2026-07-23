// ============================================================
// FORCE DYNAMIC RENDERING - Prevents prerender errors
// ============================================================
export const dynamic = 'force-dynamic';

import HomeContent from './HomeContent';

export default function HomePage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams?.q || '';

    return <HomeContent initialQuery={query} />;
}