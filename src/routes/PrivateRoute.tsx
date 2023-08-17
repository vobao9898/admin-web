import { IGlobalUser } from "context/Reducer";
import { useUser } from "hooks/useUser";
import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface IProps {
    roles?: string[];
}

const PrivateRoute: FC<IProps> = ({ roles }) => {
    const { userGlobal } = useUser();

    if (!userGlobal) return <Navigate to="/login" />;

    const isHasAccess = (user: IGlobalUser, roles?: string[]) => {
        if (!roles) return true;
        return user && user.userAdmin && user.userAdmin.roleName && roles.find((x) => x === user.userAdmin.roleName);
    };

    return isHasAccess(userGlobal, roles) ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
