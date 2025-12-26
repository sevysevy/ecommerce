import BaseLayout from '@/layouts/BaseLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import {home} from '@/routes';
import {update as cartUpdate , destroy as cartDelete} from '@/routes/cart';
import {store as checkout} from '@/routes/checkout';
import { useForm } from '@inertiajs/react';


interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
}

interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    unit_price: string;
    product: Product;
}

interface Cart {
    id: number;
    user_id: number;
    items: CartItem[];
}

interface CartPageProps {
    cart: Cart;
}

export default function CartIndex({ cart }: CartPageProps) {
    const calculateSubtotal = (item: CartItem) => {
        return (parseFloat(item.unit_price) * item.quantity).toFixed(2);
    };

    const calculateTotal = () => {
        return cart.items.reduce((total, item) => {
            return total + (parseFloat(item.unit_price) * item.quantity);
        }, 0).toFixed(2);
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        cartUpdate
        
        router.patch( cartUpdate(productId), 
            { quantity: newQuantity },
            { preserveScroll: true }
        );
    };

    const removeItem = (productId: number) => {
        if (confirm('Remove this item from cart?')) {
            router.delete(cartDelete(productId), {
                preserveScroll: true
            });
        }
    };


    const { post, processing, errors } = useForm({}); 
    const handleCheckout = () => {
        post(checkout().url, {
            preserveScroll: true,
            onError: (errors) => {
                if (errors.stock) {
                    alert(errors.stock);
                } else if (errors.cart) {
                    alert(errors.cart);
                } else {
                    alert('Unable to complete checkout.');
                }
            },
        });
    };

    return (
        <BaseLayout>
            <Head title="Shopping Cart" />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Shopping Cart
                </h1>

                {cart.items.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Add some products to get started!
                        </p>
                        <Link
                            href={home()}
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg shadow-sm p-6 flex gap-4"
                                >
                                    <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">Image</span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-gray-600 mb-3">
                                            {item.unit_price} € each
                                        </p>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center border text-black rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-12 text-center font-medium text-black">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock_quantity}
                                                className="w-8 h-8 flex items-center justify-center border text-black rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        {item.quantity >= item.product.stock_quantity && (
                                            <p className="text-xs text-amber-600 mt-2">
                                                Maximum stock reached
                                            </p>
                                        )}
                                    </div>

                                    {/* Subtotal and Remove */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            className="text-red-600 hover:text-red-700 p-2"
                                            title="Remove item"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <p className="text-lg font-bold text-gray-800">
                                            {calculateSubtotal(item)} €
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{calculateTotal()} €</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                                        <span>Total</span>
                                        <span>{calculateTotal()} €</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={processing}
                                    className={`w-full py-3 rounded font-medium mb-3
                                        ${processing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    {processing ? 'Processing...' : 'Proceed to Checkout'}
                                </button>


                                <Link
                                    href={home()}
                                    className="block text-center text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BaseLayout>
    );
}