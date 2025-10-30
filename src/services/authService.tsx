import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function isAuthenticated() {
    const token = getJWTCookie();
    if (!token) return false;

    try {
        const decoded: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decoded.exp > currentTime;
    } catch {
        return false;
    }
}

export function getJWTCookie() {
    const token = Cookies.get("jwt");
    if (!token) return false;
    return token;
}
