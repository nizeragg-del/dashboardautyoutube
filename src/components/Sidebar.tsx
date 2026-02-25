"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', href: '/', icon: '🏠' },
        { name: 'Vídeos', href: '/videos', icon: '📽️' },
        { name: 'Agendamento', href: '/scheduler', icon: '📅' },
        { name: 'Configurações', href: '/settings', icon: '⚙️' },
    ];

    return (
        <div className="w-64 h-screen bg-zinc-950 border-r border-zinc-900 p-6 flex flex-col gap-8 fixed left-0 top-0">
            <div className="text-2xl font-bold gradient-text">ViralEngine</div>

            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' : 'text-zinc-400 hover:bg-zinc-900'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto p-4 glass text-xs text-zinc-500">
                <p>Premium SaaS v1.0</p>
                <p>© Nizera&apos;s Org</p>
            </div>
        </div>
    );
};

export default Sidebar;
