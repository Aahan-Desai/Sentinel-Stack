import type { Key } from "react";

export interface Service {
    _id: Key | null | undefined;
    id: string;
    name: string;
    url: string;
    status: 'up' | 'down' | 'unknown';
    uptime: number | null;
};
