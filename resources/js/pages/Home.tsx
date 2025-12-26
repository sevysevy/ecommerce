import GuestLayout from '@/Layouts/GuestLayout';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
}

interface HomeProps {
    products: Product[];
    
}

export default function Home({ products }: HomeProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <GuestLayout>
            <Head title="Products" />
            
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Our Products
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Product image placeholder */}
                            <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
                                <span className="text-gray-400">Image</span>
                            </div>

                            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                {product.name}
                            </h2>
                            
                            <p className="text-2xl font-bold text-blue-600 mb-3">
                                ${product.price}
                            </p>

                            <div className="mb-4">
                                {product.stock_quantity > 0 ? (
                                    <span className="text-sm text-green-600 font-medium">
                                        In stock ({product.stock_quantity} available)
                                    </span>
                                ) : (
                                    <span className="text-sm text-red-600 font-medium">
                                        Out of stock
                                    </span>
                                )}
                            </div>

                            {product.stock_quantity > 0 && (
                                auth.user ? (
                                    <button
                                        type="button"
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Add to cart
                                    </button>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Login to add to cart
                                    </Link>
                                )
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </GuestLayout>
    );
}