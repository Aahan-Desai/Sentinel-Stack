import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { fetchServices } from "../lib/services.api";
import type { Service } from "../types/service";
import {
    ShieldCheck,
    LayoutDashboard,
    Activity,
    Users,
    Settings,
    Bell,
    LogOut,
    User
} from "lucide-react";

interface NavigationProps {
    services?: Service[];
}

export default function Navigation({ services: propServices }: NavigationProps) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [localServices, setLocalServices] = useState<Service[]>([]);

    useEffect(() => {
        if (!propServices) {
            fetchServices()
                .then(setLocalServices)
                .catch(err => console.error("Nav status fetch failed", err));
        }
    }, [propServices]);

    const services = propServices || localServices;
    const isPath = (path: string) => location.pathname === path;

    const renderStatusBadge = () => {
        if (services.length === 0) {
            return (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    Awaiting Data
                </div>
            );
        }

        const allUp = services.every(s => s.status === 'up');
        const allDown = services.every(s => s.status === 'down');

        let statusColor = 'bg-amber-500';
        let statusText = 'Partial Outage';

        if (allUp) {
            statusColor = 'bg-green-500';
            statusText = 'System Operational';
        } else if (allDown) {
            statusColor = 'bg-red-500';
            statusText = 'Major Outage';
        }

        return (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200">
                <div className={`w-2 h-2 rounded-full ${allUp ? '' : 'animate-pulse'} ${statusColor}`}></div>
                {statusText}
            </div>
        );
    };

    return (
        <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2 text-slate-900 hover:text-indigo-600 transition-colors">
                    <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="font-bold tracking-tight text-lg">Sentinel</span>
                </Link>

                <div className="hidden md:flex items-center gap-1 text-sm font-medium">
                    <Link
                        to="/"
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${isPath("/") ? "bg-slate-100 text-indigo-600" : "text-slate-500 hover:text-slate-900"
                            }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Overview
                    </Link>
                    <Link
                        to="/incidents"
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${isPath("/incidents") ? "bg-slate-100 text-indigo-600" : "text-slate-500 hover:text-slate-900"
                            }`}
                    >
                        <Activity className="w-4 h-4" />
                        Incidents
                    </Link>
                    <Link
                        to="/team"
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${isPath("/team") ? "bg-slate-100 text-indigo-600" : "text-slate-500 hover:text-slate-900"
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Team
                    </Link>
                    <Link
                        to="/settings"
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${location.pathname.startsWith("/settings") ? "bg-slate-100 text-indigo-600" : "text-slate-500 hover:text-slate-900"
                            }`}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {renderStatusBadge()}

                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold leading-none mb-1 text-slate-900">
                            {user?.displayName || (user?.email ? user.email.split('@')[0] : 'User')}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{user?.role}</p>
                    </div>
                    <Link to="/settings" className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-indigo-500/20 transition-all">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-4 h-4 text-indigo-600" />
                        )}
                    </Link>
                    <button
                        onClick={logout}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all active:scale-95"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
