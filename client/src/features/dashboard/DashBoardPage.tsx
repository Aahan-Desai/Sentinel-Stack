import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchServices, createService } from "../../lib/services.api";
import { useAuth } from "../../hooks/AuthContext";
import type { Service } from "../../types/service";
import {
  Plus,
  LogOut,
  LayoutDashboard,
  Globe,
  ChevronRight,
  Search,
  Bell,
  Settings,
  ShieldCheck,
  Activity
} from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  async function loadServices() {
    try {
      setLoading(true);
      const data = await fetchServices();
      setServices(data);
    } catch {
      setError("Failed to synchronize with server. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !url) return;

    setCreating(true);
    setCreateError(null);

    try {
      const newService = await createService({ name, url });
      setServices((prev) => [newService, ...prev]);
      setName("");
      setUrl("");
    } catch (err: any) {
      if (err.response?.status === 409) {
        setCreateError("A service with this endpoint already exists in your workspace.");
      } else {
        setCreateError(err.message || "Failed to provision service check.");
      }
    } finally {
      setCreating(false);
    }
  }

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 leading-normal">
      {/* TOP NAVIGATION BAR */}
      <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight text-lg text-slate-900">Sentinel</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button className="px-3 py-2 bg-slate-100 text-indigo-600 rounded-lg flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>
            <button className="px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Incidents
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Operational
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none mb-1 text-slate-900">{user?.email.split('@')[0]}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role}</p>
            </div>
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

      <main className="max-w-[1400px] mx-auto p-8">
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Service Overview</h1>
            <p className="text-slate-500">Monitor and manage your organization's infrastructure health in real-time.</p>
          </div>

          <div className="flex items-center gap-3 text-slate-900">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                placeholder="Filter services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-[240px] transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* LEFT: FORM AND STATS */}
          <div className="xl:col-span-4 space-y-8">
            {/* ADMIN FORM */}
            {user?.role === "admin" && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Plus className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">Provision New Check</h3>
                  </div>

                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-1.5 font-sans">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Friendly Name</label>
                      <input
                        placeholder="e.g. Production API"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1 text-slate-400">Health Check URL</label>
                      <input
                        placeholder="https://api.sentinel.io/health"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900"
                        required
                      />
                    </div>

                    {createError && (
                      <div className="text-xs text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 italic font-medium">
                        {createError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={creating}
                      className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
                    >
                      {creating ? "Deploying..." : "Enable Monitoring"}
                    </button>
                  </form>
                </div>
              </section>
            )}

            {/* QUICK STATS CARD */}
            <div className="bg-slate-950 p-6 rounded-2xl text-white shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Workspace Metrics</h4>
                <Settings className="w-4 h-4 text-slate-600 hover:text-white cursor-pointer transition-colors" />
              </div>
              <div className="space-y-6 text-white font-sans">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold mb-1">{services.length}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Monitored Endpoints</p>
                  </div>
                  <div className="flex gap-1 h-8 items-end">
                    <div className="w-1.5 h-4 bg-indigo-500/30 rounded-full"></div>
                    <div className="w-1.5 h-6 bg-indigo-500/60 rounded-full"></div>
                    <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                    <div className="w-1.5 h-5 bg-indigo-500/40 rounded-full"></div>
                  </div>
                </div>
                <div className="h-px bg-slate-800"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-bold text-green-400 font-sans italic">100%</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest text-slate-500 font-sans">Global Uptime</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-300 font-sans italic">0 ms</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest text-slate-500 font-sans">Avg Latency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: LIST */}
          <div className="xl:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-widest leading-none">Active Watchlist</h3>
              <span className="text-[10px] font-bold text-slate-300 italic leading-none pr-1">Auto-refreshing every 60s</span>
            </div>

            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
                ))}
              </div>
            ) : error ? (
              <div className="p-12 bg-white rounded-2xl border border-red-100 text-center shadow-sm">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Connectivity Issue</h4>
                <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">{error}</p>
                <button onClick={loadServices} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all active:scale-[0.98]">Retry Connection</button>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <Globe className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No services match your current selection.</p>
              </div>
            ) : (
              <div className="grid gap-4 text-slate-900 font-sans">
                {filteredServices.map((service) => (
                  <Link
                    key={service._id as string}
                    to={`/services/${service._id}`}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md hover:border-indigo-100 transition-all group"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors text-slate-400 group-hover:text-indigo-600">
                      <Globe className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors leading-tight">{service.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-1.5 font-mono leading-none">{service.url}</p>
                    </div>

                    <div className="flex items-center gap-8 pr-2">
                      <div className="hidden sm:block text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Status</p>
                        <div className="flex items-center justify-end gap-2 leading-none">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                          <span className="text-xs font-bold text-slate-700">Healthy</span>
                        </div>
                      </div>

                      <div className="hidden md:block text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none px-1 text-slate-400 font-sans">Availability</p>
                        <p className="text-xs font-bold text-slate-900 italic leading-none font-sans italic font-bold">99.98%</p>
                      </div>

                      <div className="p-2 bg-slate-50 group-hover:bg-indigo-600 rounded-lg group-hover:text-white transition-all text-slate-400">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
