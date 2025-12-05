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
        queryClient.setQueryData(["isAuthenticated"], false);
        await queryClient.invalidateQueries({ queryKey: ["isAuthenticated"], refetchType: "all" });
        console.log("Logout bem-sucedido — cache atualizado");
        nav("/");
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        queryClient.setQueryData(["isAuthenticated"], false);
        nav("/");
      }
    };

    handleLogout();
  }, []);

  return null;
}
