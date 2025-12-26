import BaseLayout from '@/layouts/BaseLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { home } from '@/routes';

interface Product {
    id: number;
    name: string;
    price?: string;
}

interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    unit_price: string;
    name: string;
    product?: Product;
}

interface Order {
    id: number;
    total_amount: string;
    items: OrderItem[];
    created_at: string;
}

interface SuccessProps {
    order: Order;
}

export default function Success({ order }: SuccessProps) {
    return (
        <BaseLayout>
            <Head title="Order Successful" />

            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Success Header */}
                <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-8">
                    <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Order Placed Successfully
                    </h1>
                    <p className="text-gray-600">
                        Thank you for your purchase! Your order has been confirmed.
                    </p>

                    <p className="mt-4 text-sm text-gray-500">
                        Order #{order.id} • {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Order Summary
                    </h2>

                    <div className="space-y-4">
                        {order.items.map(item => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item.quantity} × {item.unit_price} €
                                    </p>
                                </div>

                                <p className="font-semibold text-gray-800">
                                    {(parseFloat(item.unit_price) * item.quantity).toFixed(2)} €
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-6 pt-4 flex justify-between text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span>{order.total_amount} €</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="text-center">
                    <Link
                        href={home()}
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </BaseLayout>
    );
}
