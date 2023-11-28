import { cookies } from "next/headers";

export function isAuthenticated() {
    return cookies().has('token');
}