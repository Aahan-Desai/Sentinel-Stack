import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { updateProfile } from "../../lib/auth.api";
import {
    User,
    Settings,
    Bell,
    Lock,
    Globe,
    Mail,
    Save,
    ChevronRight,
    ShieldCheck,
    LayoutDashboard,
    Activity,
    Users,
    LogOut,
    CreditCard,
    Trash2
} from "lucide-react";

export default function SettingsPage() {
    const { user, logout, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'security' | 'notifications'>('profile');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [displayName, setDisplayName] = useState(user?.displayName || user?.email.split('@')[0] || "");
    const [email, setEmail] = useState(user?.email || "");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl || null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveStatus('idle');

        try {
            const updatedUser = await updateProfile({ displayName, avatarUrl });
            updateUser(updatedUser);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'organization', label: 'Organization', icon: Globe },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 leading-normal">
            {/* TOP NAVIGATION BAR */}
            <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 text-slate-900 hover:text-indigo-600 transition-colors">
                        <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="font-bold tracking-tight text-lg">Sentinel</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 text-sm font-medium">
                        <Link to="/" className="px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Overview
                        </Link>
                        <Link to="/incidents" className="px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Incidents
                        </Link>
                        <Link to="/team" className="px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Team
                        </Link>
                        <Link to="/settings" className="px-3 py-2 bg-slate-100 text-indigo-600 rounded-lg flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
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

            <main className="max-w-[1200px] mx-auto p-8">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Workforce Configuration</h1>
                    <p className="text-slate-500">Manage your personal preferences and organization-wide settings.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* SIDEBAR TABS */}
                    <div className="lg:col-span-3 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* CONTENT AREA */}
                    <div className="lg:col-span-9">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                            {activeTab === 'profile' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <div
                                            onClick={handleAvatarClick}
                                            className="w-20 h-20 rounded-2xl bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center text-indigo-600 group cursor-pointer hover:bg-indigo-100 transition-all overflow-hidden shadow-sm shadow-indigo-100"
                                        >
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">User Profile</h3>
                                            <p className="text-sm text-slate-500">Upload a photo or choose an avatar for your profile.</p>
                                            <button
                                                type="button"
                                                onClick={handleAvatarClick}
                                                className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 active:scale-95 transition-all"
                                            >
                                                Change Photo
                                            </button>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSave} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Display Name</label>
                                                <input
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-semibold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Account Role</label>
                                                <input
                                                    disabled
                                                    value={user?.role.toUpperCase()}
                                                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-semibold"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex items-center justify-between">
                                            <p className="text-xs text-slate-400 font-medium italic">Last updated: Today at 4:12 PM</p>
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10 disabled:opacity-50 active:scale-[0.98]"
                                            >
                                                {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-4 mb-8">Access Control</h3>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                                />
                                            </div>
                                            <div className="pt-2">
                                                <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98]">
                                                    Update Password
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100">
                                        <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                                            <Trash2 className="w-4 h-4" /> Danger Zone
                                        </h4>
                                        <p className="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                        <button className="px-5 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 text-xs font-bold transition-all">
                                            Terminate Account
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'organization' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="pb-6 border-b border-slate-100">
                                        <h3 className="font-bold text-lg text-slate-900">Workspace Identity</h3>
                                        <p className="text-sm text-slate-500">Configure how your team appears to external stakeholders.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Organization Name</label>
                                            <input
                                                defaultValue="Sentinel HQ"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-semibold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Workspace Slug</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-400">app.sentinel.io/</span>
                                                <input
                                                    disabled
                                                    defaultValue="sentinel-hq"
                                                    className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-indigo-900 mb-1">Billing & Subscription</h4>
                                            <p className="text-xs text-indigo-700/70 mb-3">Your workspace is currently on the Pro Annual plan.</p>
                                            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Manage Billing <ChevronRight className="inline w-3 h-3" /></button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="pb-6 border-b border-slate-100">
                                        <h3 className="font-bold text-lg text-slate-900">Incident Alerting</h3>
                                        <p className="text-sm text-slate-500">Decide how you want to be notified when services go offline.</p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { title: "Service Downtime", desc: "Get notified immediately when a service status changes to Down.", checked: true },
                                            { title: "Weekly Reports", desc: "A summary of your availability metrics delivered every Monday morning.", checked: false },
                                            { title: "Security Alerts", desc: "Notifications about new logins and security changes.", checked: true }
                                        ].map((pref, i) => (
                                            <label key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                                <div className="max-w-md">
                                                    <p className="text-sm font-bold text-slate-900">{pref.title}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{pref.desc}</p>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full relative transition-colors ${pref.checked ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pref.checked ? 'left-7' : 'left-1'}`}></div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {saveStatus === 'success' && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-center text-sm font-bold animate-in fade-in zoom-in">
                                Configuration successfully synchronized with Sentinel servers.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
