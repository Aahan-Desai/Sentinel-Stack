import { useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();

  const [tenantSlug, setTenantSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password, tenantSlug);
    } catch (err: any) {
      setError(err.message || "Invalid credentials or tenant slug");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* LEFT SIDE - BRANDING (Visual Anchor) */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Sentinel Stack</span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Enterprise-grade <br />
            <span className="text-slate-500">Service Monitoring.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            The infrastructure intelligence layer for modern engineering teams.
            Real-time status checks, multi-tenant isolation, and incident reporting.
          </p>
        </div>

        {/* Decorative background element */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl opacity-30"></div>

        <div className="relative z-10">
          <div className="h-px bg-slate-800 w-full mb-6"></div>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span>&copy; 2026 Sentinel Stack</span>
            <span>&bull;</span>
            <span>Security First Infrastructure</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold tracking-tight">Sentinel</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Sign in to manage your organization's services</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="tenant">
                Organization Slug
              </label>
              <input
                id="tenant"
                placeholder="e.g. acme-corp"
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
                Work Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 italic">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2 group transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Continue to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <span className="text-indigo-600 font-semibold cursor-pointer hover:underline underline-offset-4">Contact your administrator</span>
          </p>
        </div>
      </div>
    </div>
  );
}
