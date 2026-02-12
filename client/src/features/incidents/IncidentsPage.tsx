import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../../components/Navigation";
import {
    CheckCircle2,
    Clock,
    RefreshCcw,
    Activity,
    ChevronRight,
} from "lucide-react";
import api from "../../lib/api";

interface Incident {
    _id: string;
    serviceName: string;
    serviceId: string;
    status: 'active' | 'resolved';
    startedAt: string;
    resolvedAt?: string;
    error: string;
}

export default function IncidentsPage() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadIncidents() {
            try {
                setLoading(true);
                const res = await api.get("/incidents");
                setIncidents(res.data);
            } catch (err) {
                console.error("Failed to load incidents");
            } finally {
                setLoading(false);
            }
        }
        loadIncidents();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 leading-normal">
            <Navigation />

            <main className="max-w-4xl mx-auto py-12 px-8">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Service Disruptions</h2>
                    <p className="text-slate-500 text-sm">Review historical downtime events and recovery timelines across your infrastructure.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCcw className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                ) : incidents.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Systems Nominal</h3>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm">No infrastructure incidents have been recorded in the past 30 days.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {incidents.map((incident) => (
                            <div key={incident._id} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-indigo-100 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl shrink-0 ${incident.status === 'active' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'
                                            }`}>
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <Link to={`/services/${incident.serviceId}`} className="font-bold text-lg hover:text-indigo-600 transition-colors">
                                                    {incident.serviceName}
                                                </Link>
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${incident.status === 'active' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {incident.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm mb-4 font-medium">{incident.error}</p>

                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Started: {new Date(incident.startedAt).toLocaleString()}
                                                </div>
                                                {incident.resolvedAt && (
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-green-500 uppercase tracking-widest">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Resolved: {new Date(incident.resolvedAt).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Link to={`/services/${incident.serviceId}`} className="p-2 text-slate-300 group-hover:text-indigo-500 transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
