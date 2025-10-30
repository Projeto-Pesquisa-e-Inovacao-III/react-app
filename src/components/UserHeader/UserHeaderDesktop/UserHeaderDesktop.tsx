import { Link } from "react-router-dom";
import { LogoHeaderDesktop } from "../../LogoHeaderDesktop/LogoHeaderDesktop";
import "./style.css"
import ChangeTypeDevDebug from "../../ChangeTypeDevDebug/ChangeTypeDevDebug";
import { Bell } from "lucide-react";
import { useState } from "react";
import Notification from "../Notification/Notification";

type UserType = {
  type: "personal" | "student"
}

export default function UserHeaderDesktop({ type }: UserType) {

  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [openHeaderModal, setOpenHeaderModal] = useState<boolean>(false);

  const notifications = [
    {
      notificationTitle: "Título da Notificação",
      message: "Nova notificação!",
      icon: <Bell />,
      date: "2023-10-01",
      isRead: false
    },
    {
      notificationTitle: "Outro Título",
      message: "Outra notificação!",
      icon: <Bell />,
      date: "2023-10-02",
      isRead: false
    }
  ];

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
          {/* <div onMouseEnter={() => setOpenNotification(true)}  onMouseLeave={() => setOpenNotification(false)} className="notification-bell"> */}
          <div onClick={() => setOpenNotification(!openNotification)} className="notification-bell">
            <Bell />
          </div>
          <div className="user-info-desktop" onClick={() => setOpenHeaderModal(!openHeaderModal)}>
            <img src="https://thispersondoesnotexist.com" alt="" />
          </div>
        </div>

      </header >

      {openNotification && (
        <Notification notifications={notifications} />
      )
      }

      {openHeaderModal && (
        <div className="header-modal-desktop" onClick={() => setOpenHeaderModal(false)}>
          <div className="header-modal-content-desktop" onClick={(e) => e.stopPropagation()}>
            <Link to="/edit-user">Editar perfil</Link>
            <Link to="/logout">Sair</Link>
          </div>
        </div>
      )
      }
    </>
  );
}


