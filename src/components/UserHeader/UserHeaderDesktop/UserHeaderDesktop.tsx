import { Link, NavLink } from "react-router-dom";
import { LogoHeaderDesktop } from "../../LogoHeaderDesktop/LogoHeaderDesktop";
import styles from "./UserHeaderDesktop.module.css"
import { useEffect, useState } from "react";
import UserAvatar from "../../UserAvatar/UserAvatar";
import { useQueryClient } from "@tanstack/react-query";

type UserType = {
  type: "personal" | "student"
}

export default function UserHeaderDesktop({ type }: UserType) {

  const [openHeaderModal, setOpenHeaderModal] = useState<boolean>(false);

  const queryClient = useQueryClient();

  queryClient.invalidateQueries({ queryKey: ['userImage'] });

  //verificar se o link está ativo para adicionar a classe active
  const navLinkClass = ({ isActive }: { isActive: boolean }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

  return (
    <>
      <header className={styles.userHeaderDesktop}>
        <nav className={styles.nav}>
        <Link to="/"><LogoHeaderDesktop /></Link>
          {type === 'personal' ? (
            <>
              <NavLink to="/home" className={navLinkClass}>Início</NavLink>
              <NavLink to="/schedule" className={navLinkClass}>Agenda</NavLink>
              <NavLink to="/personal/check-schedule" className={navLinkClass}>Solicitações</NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/packages" className={navLinkClass}>Planos</NavLink>
              <NavLink to="/users" className={navLinkClass}>Usuários</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/home" className={navLinkClass}>Início</NavLink>
              <NavLink to="/schedule" className={navLinkClass}>Agenda</NavLink>
              <NavLink to="/packages" className={navLinkClass}>Planos</NavLink>
              <NavLink to="/plans-history" className={navLinkClass}>Histórico de planos</NavLink>
              <NavLink to="/schedule-history" className={navLinkClass}>Histórico de agendamentos</NavLink>
            </>
          )
          }
        </nav>

        <div className={styles.authLinks}>
          <div onClick={() => setOpenHeaderModal(!openHeaderModal)} className={styles.userAvatarHeaderDesktop}>
            <UserAvatar useUsername={true} useUserImage={true} />
          </div>
        </div>

      </header >

      {openHeaderModal && (
        <div className={styles.headerModalDesktop} onClick={() => setOpenHeaderModal(false)}>
          <div className={styles.headerModalContentDesktop} onClick={(e) => e.stopPropagation()}>
            <Link to="/edit-user">Editar perfil</Link>
            {type === "personal" && <Link to="/set-availability">Ajustar disponibilidade</Link>}
            <Link to="/logout">Sair</Link>
          </div>
        </div>
      )
      }
    </>
  );
}
