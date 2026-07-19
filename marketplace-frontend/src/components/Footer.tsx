export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">🛒 Marketplace</h3>
                        <p className="text-gray-400">Buy and sell products with confidence. The best marketplace for everyone.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/" className="hover:text-white">Home</a></li>
                            <li><a href="/cart" className="hover:text-white">Cart</a></li>
                            <li><a href="/orders" className="hover:text-white">Orders</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <p className="text-gray-400">support@marketplace.com</p>
                        <p className="text-gray-400">© 2024 Marketplace. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}