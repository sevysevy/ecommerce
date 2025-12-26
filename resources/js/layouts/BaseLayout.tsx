import { PropsWithChildren } from 'react';
import { dashboard, login, register, home, logout} from '@/routes';
import CartController from '@/actions/App/Http/Controllers/CartController';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

export default function BaseLayout({ children }: PropsWithChildren) {
    const { auth, cartItemCount } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link
                        href={home()}
                        className="text-xl font-semibold text-blue-600"
                    >
                        Simple Shop
                    </Link>
                    
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <>
                                <span className="text-gray-600 text-sm">
                                    Welcome, {auth.user.name}
                                </span>
                                
                                <Link
                                    href={CartController.index()}
                                    className="relative bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <ShoppingCart size={18} />
                                    <span>Cart</span>
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                                
                                <Link
                                    href={logout()}
                                    className=" text-black px-4 py-2"
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={register()}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} Simple Shop
                </div>
            </footer>
        </div>
    );
}
