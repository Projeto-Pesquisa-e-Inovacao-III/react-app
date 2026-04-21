import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./authService";
import type { JSX } from "react";

export function PrivateRoute({ children }: { children: JSX.Element }) {
    return isAuthenticated() ? children : <Navigate to="/login" />;
}