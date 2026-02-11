import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { fetchTeamMembers, inviteMember } from "../../lib/team.api";
import type { TeamMember } from "../../lib/team.api";
import {
    Users,
    UserPlus,
    Shield,
    ShieldCheck,
    ShieldAlert,
    MoreVertical,
    Mail,
    Search,
    Bell,
    LogOut,
    LayoutDashboard,
    Activity,
    ShieldQuestion,
    X
} from "lucide-react";

export default function TeamPage() {
    const { user, logout } = useAuth();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // Form state
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
    const [isInviting, setIsInviting] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);

    async function loadMembers() {
        try {
            setLoading(true);
            const data = await fetchTeamMembers();
            setMembers(data);
        } catch {
            setError("Failed to sync team data. Please refresh.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMembers();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviteError(null);
        setIsInviting(true);

        try {
            const newMember = await inviteMember({ email: inviteEmail, role: inviteRole });
            setMembers([newMember, ...members]);
            setIsInviteModalOpen(false);
            setInviteEmail("");
            setInviteRole("member");
        } catch (err: any) {
            setInviteError(err.response?.data?.message || "Failed to deliver invitation.");
        } finally {
            setIsInviting(false);
        }
    };

    const filteredMembers = members.filter(m =>
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
            case 'member': return <Shield className="w-4 h-4 text-slate-500" />;
            case 'viewer': return <ShieldQuestion className="w-4 h-4 text-slate-400" />;
            default: return null;
        }
    };

    const getRoleStyles = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'member': return 'bg-slate-50 text-slate-700 border-slate-200';
            case 'viewer': return 'bg-slate-50 text-slate-500 border-slate-100';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

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
                        <Link to="/" className="px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Overview
                        </Link>
                        <Link to="/incidents" className="px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Incidents
                        </Link>
                        <Link to="/team" className="px-3 py-2 bg-slate-100 text-indigo-600 rounded-lg flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Team
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
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Team Management</h1>
                        <p className="text-slate-500">Manage your organization's members and their access levels.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                placeholder="Search members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-[240px] transition-all shadow-sm"
                            />
                        </div>
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
                            >
                                <UserPlus className="w-4 h-4" />
                                Invite Member
                            </button>
                        )}
                    </div>
                </div>

                {/* TEAM GRID */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Synchronizing Team...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex items-center justify-center p-12 text-center">
                            <div>
                                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Sync failed</h4>
                                <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">{error}</p>
                                <button onClick={loadMembers} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all">Retry Sync</button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Member</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Role</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredMembers.map((member) => (
                                        <tr key={member._id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all font-mono">
                                                        {member.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 mb-0.5">{member.email.split('@')[0]}</p>
                                                        <p className="text-xs text-slate-400 font-medium">{member.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${getRoleStyles(member.role)}`}>
                                                    {getRoleIcon(member.role)}
                                                    <span className="capitalize">{member.role}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : member.status === 'pending' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'bg-slate-300'}`}></div>
                                                    <span className={`text-xs font-bold capitalize ${member.status === 'active' ? 'text-slate-600' : member.status === 'pending' ? 'text-amber-600' : 'text-slate-400'}`}>
                                                        {member.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-lg hover:bg-white border border-transparent hover:border-slate-200">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredMembers.length === 0 && (
                                <div className="py-20 text-center">
                                    <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-medium">No team members found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ACCESS LEVELS OVERVIEW */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-2 bg-indigo-50 rounded-lg w-fit mb-4 text-indigo-600">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Administrators</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-sans">Full access to service provisioning, team management, and billing configurations.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-2 bg-slate-100 rounded-lg w-fit mb-4 text-slate-600">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Members</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-sans">Can manage existing services and view incidents. Cannot modify team or billing settings.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-2 bg-slate-50 rounded-lg w-fit mb-4 text-slate-400">
                            <ShieldQuestion className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Viewers</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-sans">Read-only access to monitoring dashboards and reports. Ideal for external stakeholders.</p>
                    </div>
                </div>
            </main>

            {/* INVITE MODAL */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsInviteModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Invite New Member</h3>
                                <p className="text-sm text-slate-500 mt-1">Send an invitation link to your team.</p>
                            </div>
                            <button
                                onClick={() => setIsInviteModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleInvite} className="p-8 space-y-6">
                            {inviteError && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                    <ShieldAlert className="w-4 h-4 shrink-0" />
                                    {inviteError}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        placeholder="teammate@company.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Assigned Role</label>
                                <div className="grid grid-cols-1 gap-3">
                                    <label className="relative flex items-start gap-4 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="member"
                                            checked={inviteRole === 'member'}
                                            onChange={() => setInviteRole('member')}
                                            className="mt-1 accent-indigo-600"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Member</p>
                                            <p className="text-xs text-slate-500 mt-1">Standard access to services and monitoring.</p>
                                        </div>
                                    </label>
                                    <label className="relative flex items-start gap-4 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="admin"
                                            checked={inviteRole === 'admin'}
                                            onChange={() => setInviteRole('admin')}
                                            className="mt-1 accent-indigo-600"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Administrator</p>
                                            <p className="text-xs text-slate-500 mt-1">Full control over the organization and members.</p>
                                        </div>
                                    </label>
                                    <label className="relative flex items-start gap-4 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="viewer"
                                            checked={inviteRole === 'viewer'}
                                            onChange={() => setInviteRole('viewer')}
                                            className="mt-1 accent-indigo-600"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Viewer</p>
                                            <p className="text-xs text-slate-500 mt-1">Read-only access for visibility without control.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isInviting}
                                    className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isInviting ? "Sending..." : "Send Invitation"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
