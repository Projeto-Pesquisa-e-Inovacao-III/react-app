import { useEffect } from "react";
import { logout } from "../../../constants/user";
import { useNavigate } from "react-router-dom";

export default function Logout() {

  const nav = useNavigate();

  useEffect(() => {
    logout().then(() => {
      nav("/");
    });
  }, []);

  return null;
}
