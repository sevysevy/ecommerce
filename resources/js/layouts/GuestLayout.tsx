import { PropsWithChildren } from 'react';
import { dashboard, login, register, home, logout } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link
                        href={home()}
                        className="text-xl font-semibold text-blue-600"
                    >
                        Simple Shop
                    </Link>
                    
                    <nav className="space-x-4">
                        {auth.user ? (
                            <>
                                <span className="text-xl text-gray-600 hover:text-gray-900">Welcome {auth.user.name}</span>

                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-sm bg-blue-600 text-white  px-5 py-1.5 text-sm leading-normal"
                                >
                                    Dashboard
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

            {/* Main content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} Simple Shop
                </div>
            </footer>
        </div>
    );
}