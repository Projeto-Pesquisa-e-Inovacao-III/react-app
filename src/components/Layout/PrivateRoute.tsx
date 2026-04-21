import { useContext } from 'react';
import { TypeContext } from '../../App';
import { Navigate, Outlet } from 'react-router-dom';
import type { Roles } from '../../App';

type PrivateRouteProps = {
    allowedRoles?: Array<Roles>;
};

export function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
    const userRole = useContext(TypeContext);

    if (userRole?.type && allowedRoles) {
        const hasAllowedRole = userRole.type.some(role => allowedRoles.includes(role));

        if (!hasAllowedRole) {
            return <Navigate to="/home" replace />;
        }
    }

    return <Outlet />;
}