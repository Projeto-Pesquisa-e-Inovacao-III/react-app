import { Link } from "react-router-dom";
import { LogoHeaderDesktop } from "../../LogoHeaderDesktop";
import "./style.css"
import ChangeTypeDevDebug from "../../ChangeTypeDevDebug";
import type React from "react";
import { Bell } from "lucide-react";

type UserType = {
  typeState: React.Dispatch<React.SetStateAction<"personal" | "student">>;
  type: "personal" | "student"
}

export default function UserHeaderDesktop({ typeState, type }: UserType) {


  return (
    <>
      <header className="user-header-desktop">
        <LogoHeaderDesktop />
        <nav>
          {type === 'personal' ? (
            <>
              <Link to="/home">Inicio</Link>
              <Link to="/schedule">Agenda</Link>
              <Link to="/personal/check-schedule">Solicitações</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/packages">Assinatura</Link>
              <Link to="/users">Usuários</Link>
            </>
          ) : (
            <>
              <Link to="/home">Inicio</Link>
              <Link to="/schedule">Agenda</Link>
              <Link to="/packages">Planos</Link>
              <Link to="#plans-section">Histórico de planos</Link>
            </>
          )
          }
        </nav>

        <div className="auth-links">
          <Bell />
          <Link to="/edit-user">
            <img src="https://thispersondoesnotexist.com" alt="" />
          </Link>
        </div>

        <ChangeTypeDevDebug changeTypeTo={typeState} />

      </header>
    </>
  );
}
