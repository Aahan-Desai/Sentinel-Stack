import type { Key } from "react";

export interface Service {
    _id: Key | null | undefined;
    id: string;
    name: string;
    url: string;
    status: 'UP' | 'DOWN';
    uptime: number;
};
