import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function isAuthenticated() {
    const token = Cookies.get("jwt");
    console.log("AuthService - token:", token);
    if (!token) return false;

    try {
        const decoded: { exp: number } = jwtDecode(token);
        console.log("AuthService - decoded:", decoded);
        const currentTime = Date.now() / 1000;
        console.log("AuthService - currentTime:", currentTime);

        console.log("AuthService - isAuthenticated:", decoded.exp > currentTime);
        return decoded.exp > currentTime;
    } catch {
        return false;
    }
}