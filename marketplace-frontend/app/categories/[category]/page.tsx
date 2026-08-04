import CategoryPage from '@/components/CategoryPage';

interface PageProps {
    params: {
        category: string;
    };
}

export default function CategoryRoute({ params }: PageProps) {
    return <CategoryPage category={params.category} />;
}