"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, User, Video, Calendar, Settings, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Vídeos', href: '/videos', icon: <Video size={20} /> },
        { name: 'Agendamento', href: '/scheduler', icon: <Calendar size={20} /> },
        { name: 'Configurações', href: '/settings', icon: <Settings size={20} /> },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-80 h-full bg-[#080808] border-l border-white/5 p-8 flex flex-col gap-10 shadow-2xl animate-in slide-in-from-right duration-500 ease-out">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold gradient-text tracking-tighter">ViralEngine</div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                <div className="flex items-center gap-4 p-4 glass bg-white/[0.02]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-white/10">
                        <User size={24} className="text-zinc-400" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">Minha Conta</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">Premium Plan</div>
                    </div>
                </div>

                <nav className="flex flex-col gap-3">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive
                                        ? 'bg-white/5 text-white border border-white/10 shadow-lg'
                                        : 'text-zinc-500 hover:text-white hover:bg-white/[0.02]'
                                    }`}
                            >
                                <span className={isActive ? 'text-youtube' : ''}>{item.icon}</span>
                                <span className="font-semibold text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto p-4 text-[10px] text-zinc-600 font-medium uppercase tracking-[0.2em]">
                    <p>© Nizera&apos;s Org v1.0.2</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
