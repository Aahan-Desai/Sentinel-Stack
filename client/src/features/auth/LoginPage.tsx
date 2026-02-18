import { useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { ShieldCheck, ArrowRight, Loader2, UserPlus, Eye, Activity } from "lucide-react";
import api from "../../lib/api";

export default function LoginPage() {
  const { login } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [tenantSlug, setTenantSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegister) {
        await api.post("/auth/register",
          { email, password, role: "admin" },
          { headers: { "x-tenant-slug": tenantSlug } }
        );
        setSuccess("Account created successfully! You can now log in.");
        setIsRegister(false);
      } else {
        await login(email, password, tenantSlug);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setLoading(true);
    setError(null);
    try {
      await login("guest@sentinel.io", "demo1234", "demo-workspace");
    } catch (err: any) {
      setError("Demo workspace is currently offline. Please try manual login.");
    } finally {
      setLoading(false);
    }
  }

  const scrollToAuth = () => {
    document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-center">
        <div className="max-w-7xl w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Sentinel Stack</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Features</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Docs</a>
            <button onClick={scrollToAuth} className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Dashboard</button>
          </div>

          <button
            onClick={scrollToAuth}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            Start Monitoring
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden bg-gradient-to-b from-white to-blue-50/50">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-in fade-in slide-in-from-bottom-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">v2.0 is now live</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl leading-[1.1]">
            Monitor Your Infrastructure <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 italic">with Confidence.</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
            Real-time uptime monitoring, instant alerts, and multi-tenant reliability — built for modern engineering teams who value precision over guesswork.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={scrollToAuth}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-2"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleDemoLogin}
              className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <Eye className="w-5 h-5" /> View Demo
            </button>
          </div>

          {/* BACKGROUND DECORATION */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        </div>
      </section>

      {/* 3. AUTH SECTION */}
      <section id="auth-section" className="py-24 px-6 flex justify-center bg-white">
        <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-16 items-start">

          <div className="lg:max-w-md">
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Enterprise-grade <br /> Service Monitoring.</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-fit"><ShieldCheck className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold mb-1">Tenant Isolation</h4>
                  <p className="text-sm text-slate-500">Every organization gets its own dedicated, securely isolated workspace environment.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-fit"><Activity className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold mb-1">Real-time Telemetry</h4>
                  <p className="text-sm text-slate-500">Distributed background workers probe your endpoints and calculate uptime with precision.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {isRegister ? "Create account" : "Welcome back"}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {isRegister
                  ? "Set up your workspace and start monitoring"
                  : "Sign in to manage your infrastructure"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Organization Slug</label>
                <input
                  placeholder="e.g. acme-corp"
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-medium"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 italic">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 text-green-600 text-xs font-bold rounded-xl border border-green-100">
                  {success}
                </div>
              )}

              <div className="pt-2 gap-3 flex flex-col">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-200"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{isRegister ? "Sign Up" : "Sign In to Dashboard"}</span>
                      {isRegister ? <UserPlus className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </>
                  )}
                </button>

                {!isRegister && (
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    Launch Guest Demo
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
              >
                {isRegister ? "Use existing account" : "Create new workspace"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-100 flex justify-center bg-slate-50/50">
        <div className="max-w-7xl w-full px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
            <span>&copy; 2026 Sentinel Stack</span>
            <span>&bull;</span>
            <span>Enterprise Infrastructure</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

