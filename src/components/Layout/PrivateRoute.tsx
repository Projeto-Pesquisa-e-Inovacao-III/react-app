import { useContext } from 'react';
import { TypeContext } from '../../App';
import { Navigate, Outlet } from 'react-router-dom';
import type { UserType } from '../../App';

type PrivateRouteProps = {
    // isAuthenticated: boolean;
    // userRole?: "aluno" | "personal";
    allowedRoles?: Array<UserType>;
};

export function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
    // if (!isAuthenticated) {
    //     return <Navigate to="/login" replace />;
    // }

    const userRole = useContext(TypeContext);
    
    console.log("PrivateRoute - userRole:", userRole?.type);
    if (userRole?.type && allowedRoles && !allowedRoles.includes(userRole.type)) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}