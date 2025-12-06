import { useEffect } from "react";
import { logout } from "../../../constants/user";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function Logout() {

  const nav = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();

        queryClient.removeQueries({ queryKey: ["isAuthenticated"] });
        queryClient.removeQueries({ queryKey: ["actualPlan"] });

        nav("/", { replace: true });
      } catch (e) {
        queryClient.removeQueries({ queryKey: ["isAuthenticated"] });
        queryClient.removeQueries({ queryKey: ["actualPlan"] });

        nav("/", { replace: true });
      }
    };

    handleLogout();
  }, []);

  return null;
}
