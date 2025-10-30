import { Link } from "react-router-dom";
import { LogoHeaderDesktop } from "../../LogoHeaderDesktop/LogoHeaderDesktop";
import "./style.css"
import ChangeTypeDevDebug from "../../ChangeTypeDevDebug/ChangeTypeDevDebug";
import { Bell } from "lucide-react";

type UserType = {
  type: "personal" | "student"
}

export default function UserHeaderDesktop({ type }: UserType) {


  return (
    <>
      <header className="user-header-desktop">
        <Link to="/"><LogoHeaderDesktop /></Link>
        <nav>
          {type === 'personal' ? (
            <>
              <Link to="/home">Inicio</Link>
              <Link to="/schedule">Agenda</Link>
              <Link to="/personal/check-schedule">Solicitações</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/packages">Planos</Link>
              <Link to="/users">Usuários</Link>
            </>
          ) : (
            <>
              <Link to="/home">Inicio</Link>
              <Link to="/schedule">Agenda</Link>
              <Link to="/packages">Planos</Link>
              <Link to="/plans-history">Histórico de planos</Link>
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

      </header>
    </>
  );
}
