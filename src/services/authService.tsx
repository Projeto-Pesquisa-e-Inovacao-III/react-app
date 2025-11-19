import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function isAuthenticated() {
    const token = getJWTCookie();
    console.log("Token:", token);
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
    console.log("Token from cookie:", token);
    if (!token) return false;
    return token;
}
