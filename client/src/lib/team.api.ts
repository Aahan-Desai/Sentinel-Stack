import api from "./api";

export interface TeamMember {
    _id: string;
    email: string;
    role: 'admin' | 'member' | 'viewer';
    status: 'active' | 'disabled' | 'pending';
    createdAt: string;
}

/**
 * Fetch all team members for the current tenant
 */
export async function fetchTeamMembers(): Promise<TeamMember[]> {
    const res = await api.get("/users");
    return res.data.users || [];
}

/**
 * Invite a new member (admin only)
 */
export async function inviteMember(payload: {
    email: string;
    role: string;
}): Promise<TeamMember> {
    const res = await api.post("/users/invite", payload);
    return res.data;
}
