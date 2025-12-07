import React, { useContext } from 'react'
import { TypeContext } from '../../App';
import { Navigate, Outlet } from 'react-router-dom';

const routesPersonal = [
    "/dashboard",
    "/users",
    "/users/view-user-data",
    "/edit-user",
    "/personal/check-schedule",
    "/more-options",
    "/set-availability",

    "/schedule-details",
    "/packages",
];

const routesAluno = [
    "/home",
    "/plans-history",
    "/schedule",
    "/schedule-history",
    "/schedule-details",

    "/plans-history-details",
    "/packages",
];


type PrivateRouteProps = {
    // isAuthenticated: boolean;
    // userRole?: "aluno" | "personal";
    allowedRoles?: Array<"aluno" | "personal">;
};

export function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
    // if (!isAuthenticated) {
    //     return <Navigate to="/login" replace />;
    // }

    const userRole = useContext(TypeContext)?.type;

    if (allowedRoles && !allowedRoles.includes(userRole!)) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}