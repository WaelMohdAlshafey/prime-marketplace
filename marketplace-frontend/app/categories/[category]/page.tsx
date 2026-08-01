import CategoryPage from '@/components/CategoryPage';

interface CategoryPageProps {
    params: {
        category: string;
    };
}

export default function CategoryRoute({ params }: CategoryPageProps) {
    return <CategoryPage category={params.category} />;
}