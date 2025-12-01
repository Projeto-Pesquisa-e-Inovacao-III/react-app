import { useEffect } from "react";
import { logout } from "../../../constants/user";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function Logout() {

  const nav = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    
    logout().then(() => {
      queryClient.invalidateQueries({ queryKey: ["isAuthenticated"] });
      nav("/");
    }).catch((error) => {
      console.error("Erro ao fazer logout:", error);
      nav("/");
    });
  }, []);

  return null;
}
