import { connection } from 'next/server';
import HomeContent from './HomeContent';

export default async function HomePage() {
    // This tells Next.js to skip prerendering and wait for the actual request
    await connection();

    return <HomeContent initialQuery="" />;
}