import CategoryPage from '@/components/CategoryPage';

export default function CategoryRoute({ params }: { params: { category: string } }) {
    const category = Array.isArray(params.category) ? params.category[0] : params.category;
    return <CategoryPage category={category} />;
}