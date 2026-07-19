import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-4xl font-bold text-gray-700">404</h1>
            <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
            <p className="text-gray-500 mt-2">The page you are looking for does not exist.</p>
            <Link
                href="/"
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Go Home
            </Link>
        </div>
    );
}