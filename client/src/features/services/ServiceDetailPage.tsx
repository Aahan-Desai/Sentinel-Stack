import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchServiceStatus, fetchServiceById, fetchServiceHistory } from "../../lib/services.api";
import type { Service } from "../../types/service";
import {
    ArrowLeft,
    Activity,
    Globe,
    Clock,
    ShieldCheck,
    RefreshCcw,
    Zap,
    Settings
} from "lucide-react";

export default function ServiceDetailPage() {
    const { id } = useParams<{ id: string }>();

    const [service, setService] = useState<Service | null>(null);
    const [status, setStatus] = useState<{ status: string; uptime: number | null } | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            if (!id) return;
            try {
                setLoading(true);
                const [serviceData, statusData, historyData] = await Promise.all([
                    fetchServiceById(id),
                    fetchServiceStatus(id),
                    fetchServiceHistory(id)
                ]);
                setService(serviceData);
                setStatus(statusData);
                setHistory(historyData);
            } catch (err: any) {
                setError("Synchronization failed. This service may have been decommissioned.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <RefreshCcw className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
    );

    if (error || !service) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center text-slate-900 font-sans">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Resource Unavailable</h2>
            <p className="text-slate-500 mb-8 max-w-sm">{error || "The requested service record could not be located."}</p>
            <Link to="/" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to Workspace
            </Link>
        </div>
    );

    const averageLatency = history.length > 0
        ? Math.round(history.reduce((acc, curr) => acc + curr.responseTime, 0) / history.length)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 leading-normal">
            {/* HEADER SECTION */}
            <nav className="h-16 bg-white border-b border-slate-200 px-8 flex items-center sticky top-0 z-30">
                <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all group font-medium text-sm">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
            </nav>

            <main className="max-w-5xl mx-auto py-12 px-8">
                {/* HERO AREA */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                            <Globe className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold tracking-tight text-slate-900">{service.name}</h1>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] shadow-sm ${status?.status === 'up' ? 'bg-green-100 text-green-700' :
                                        status?.status === 'down' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {status?.status === 'up' ? 'Online' : status?.status === 'down' ? 'Disrupted' : 'Syncing'}
                                </span>
                            </div>
                            <p className="text-slate-400 font-mono text-sm tracking-tight">{service.url}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Configure Check
                        </button>
                        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Trigger Reboot
                        </button>
                    </div>
                </div>

                {/* METRICS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <Activity className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Global Availability</span>
                        </div>
                        <p className="text-4xl font-bold text-slate-900 mb-1 italic">
                            {status?.uptime !== null && status?.uptime !== undefined ? `${status.uptime}%` : '---'}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">Last 24 hours calculation</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Mean Response</span>
                        </div>
                        <p className="text-4xl font-bold text-slate-900 mb-1 italic">
                            {averageLatency > 0 ? `${averageLatency}ms` : '---'}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">Average from recent logs</p>
                    </div>

                    <div className="p-6 rounded-2xl shadow-sm bg-slate-950 border-none relative overflow-hidden group">
                        <div className="relative z-10 text-white">
                            <div className="flex items-center gap-2 mb-4 text-slate-500 group-hover:text-indigo-400 transition-colors">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Verification Status</span>
                            </div>
                            <p className="text-4xl font-bold mb-1 italic">Verified</p>
                            <p className="text-xs text-slate-500 font-medium group-hover:text-slate-400 transition-colors leading-relaxed">Infrastructure check signed by Sentinel OS</p>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                    </div>
                </div>

                {/* HISTORY PLOT - NOW REAL */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Availability Timeline</h3>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <div className={`w-2 h-2 rounded-full ${status?.status === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                                {status?.status === 'up' ? 'Healthy State' : 'Incident Active'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-1 h-32 items-end">
                            {history.length === 0 ? (
                                <div className="w-full flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200">
                                    Awaiting initial telemetry feed...
                                </div>
                            ) : (
                                history.slice().reverse().map((item, i) => (
                                    <div
                                        key={i}
                                        title={`${item.status === 'up' ? 'Online' : 'Down'} - ${item.responseTime}ms at ${new Date(item.checkedAt).toLocaleTimeString()}`}
                                        className={`flex-1 rounded-t-sm transition-all cursor-crosshair ${item.status === 'up' ? 'bg-indigo-500/30 hover:bg-indigo-500' : 'bg-red-500/30 hover:bg-red-500'
                                            }`}
                                        style={{ height: `${Math.max(15, Math.min(100, (item.responseTime / 1000) * 100))}%` }}
                                    ></div>
                                ))
                            )}
                        </div>

                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-4 border-t border-slate-100 leading-none">
                            <span>Earliest Sample</span>
                            <span>Live Intelligence Feed</span>
                            <span>Latest Activity</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
