import { Link, NavLink } from "react-router-dom";
import { LogoHeaderDesktop } from "../../LogoHeaderDesktop/LogoHeaderDesktop";
import styles from "./UserHeaderDesktop.module.css"
import { useEffect, useRef, useState } from "react";
import UserAvatar from "../../UserAvatar/UserAvatar";
import { useQueryClient } from "@tanstack/react-query";
import useClickOutside from "../../../hooks/useClickOutside";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

type UserType = {
  userName: string;
  type: "personal" | "student"
  isLoading: boolean;
}

export default function UserHeaderDesktop({ userName, type, isLoading }: UserType) {

  const [openHeaderModal, setOpenHeaderModal] = useState<boolean>(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['userImage'] });
  }, []);

  const userRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: userRef,
    callback: () => {
      if (openHeaderModal) {
        setOpenHeaderModal(false);
      }
    }
  });

  //verificar se o link está ativo para adicionar a classe active
  const navLinkClass = ({ isActive }: { isActive: boolean }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = () => setMenuOpen(false);
  return (
    <>
      <header className={styles.userHeaderDesktop}>
        <nav className={styles.nav}>
          <Link to="/"><LogoHeaderDesktop /></Link>

          {isLoading && (
            <div className="flex">
              <Skeleton width={120} height={20} style={{ margin: '0 10px' }} />
              <Skeleton width={120} height={20} style={{ margin: '0 10px' }} />
              <Skeleton width={120} height={20} style={{ margin: '0 10px' }} />
              <Skeleton width={120} height={20} style={{ margin: '0 10px' }} />
              <Skeleton width={120} height={20} style={{ margin: '0 10px' }} />
              <Skeleton width={120} height={20} style={{ margin: '0 10px' }} />
            </div>
          )}

          {!isLoading && type && (
            type === 'personal' ? (
              <>
                <NavLink to="/home" className={navLinkClass}>Início</NavLink>
                <NavLink to="/schedule" className={navLinkClass}>Agenda</NavLink>
                <NavLink to="/personal/check-schedule" className={navLinkClass}>Solicitações</NavLink>
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/set-availability" className={navLinkClass}>Disponibilidade</NavLink>
                <NavLink to="/packages" className={navLinkClass}>Pacotes</NavLink>
                <NavLink to="/users" className={navLinkClass}>Alunos</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/home" className={navLinkClass}>Início</NavLink>
                <NavLink to="/schedule" className={navLinkClass}>Agenda</NavLink>
                <NavLink to="/packages" className={navLinkClass}>Pacotes</NavLink>
                <NavLink to="/plans-history" className={navLinkClass}>Histórico de compras</NavLink>
                <NavLink to="/schedule-history" className={navLinkClass}>Histórico de agendamentos</NavLink>
              </>
            )
          )}

          <div className={`${styles.navLinks} ${menuOpen ? styles.navOpen : ''}`}>
            {type === 'personal' ? (
              <>
                <NavLink to="/home" className={navLinkClass} onClick={handleNavClick}>Início</NavLink>
                <NavLink to="/schedule" className={navLinkClass} onClick={handleNavClick}>Agenda</NavLink>
                <NavLink to="/personal/check-schedule" className={navLinkClass} onClick={handleNavClick}>Solicitações</NavLink>
                <NavLink to="/dashboard" className={navLinkClass} onClick={handleNavClick}>Dashboard</NavLink>
                <NavLink to="/set-availability" className={navLinkClass} onClick={handleNavClick}>Disponibilidade</NavLink>
                <NavLink to="/packages" className={navLinkClass} onClick={handleNavClick}>Pacotes</NavLink>
                <NavLink to="/users" className={navLinkClass} onClick={handleNavClick}>Alunos</NavLink>

              </>
            ) : (
              <>
                <NavLink to="/home" className={navLinkClass} onClick={handleNavClick}>Início</NavLink>
                <NavLink to="/schedule" className={navLinkClass} onClick={handleNavClick}>Agenda</NavLink>
                <NavLink to="/packages" className={navLinkClass} onClick={handleNavClick}>Pacotes</NavLink>
                <NavLink to="/plans-history" className={navLinkClass} onClick={handleNavClick}>Histórico de compras</NavLink>
                <NavLink to="/schedule-history" className={navLinkClass} onClick={handleNavClick}>Histórico de agendamentos</NavLink>
              </>
            )}


            {menuOpen && (
              <div className={styles.navOtherLinks}>
                <NavLink to="/edit-user" className={navLinkClass} onClick={handleNavClick}>Editar informações</NavLink>
                <NavLink to="/logout" className={navLinkClass} onClick={handleNavClick}>Sair</NavLink>
              </div>
            )}
          </div>


        </nav>

        <div ref={userRef} className={styles.authLinks}>

          <div
            onClick={() => setOpenHeaderModal(prev => !prev)}
            className={styles.userAvatarHeaderDesktop}
          >
            <UserAvatar userName={userName} useUsername useUserImage isLoading={isLoading} />
          </div>
          <button
            className={styles.burgerButton}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Menu"
          >
            <span className={`${styles.burgerLine} ${menuOpen ? styles.open : ''}`} />
            <span className={`${styles.burgerLine} ${menuOpen ? styles.open : ''}`} />
            <span className={`${styles.burgerLine} ${menuOpen ? styles.open : ''}`} />
          </button>

          {openHeaderModal && (
            <div className={styles.headerModalDesktop}>
              <div className={styles.headerModalContentDesktop}>
                <Link onClick={() => setOpenHeaderModal(false)} to="/edit-user">Editar perfil</Link>
                {type === "personal" &&
                  <Link onClick={() => setOpenHeaderModal(false)} to="/set-availability">
                    Ajustar disponibilidade
                  </Link>}
                <Link onClick={() => setOpenHeaderModal(false)} to="/logout">Sair</Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
