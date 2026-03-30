import { useWebAuthnContext } from "#/hooks/useWebAuthn";
import { Navigate, Outlet, useLocation } from "react-router";
import { ROUTES } from "./config";

export const PrivateRoute = () => {
  const { isAuthorized } = useWebAuthnContext();
  const location = useLocation();

  if (isAuthorized) {
    return <Outlet />;
  }

  return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
};
