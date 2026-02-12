import api from "./api";

export interface TeamMember {
    _id: string;
    email: string;
    role: 'admin' | 'member' | 'viewer';
    status: 'active' | 'disabled' | 'pending';
    createdAt: string;
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
    const res = await api.get("/users");
    return res.data.users || [];
}

export async function inviteMember(payload: {
    email: string;
    role: string;
}): Promise<TeamMember> {
    const res = await api.post("/users/invite", payload);
    return res.data;
}
