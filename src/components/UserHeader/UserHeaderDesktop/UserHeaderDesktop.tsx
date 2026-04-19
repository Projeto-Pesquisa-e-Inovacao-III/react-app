import { Link, NavLink } from "react-router-dom";
import { User, Calendar, LogOut, MapPin, ChevronDown } from "lucide-react";
import { LogoHeaderDesktop } from "../../LogoHeaderDesktop/LogoHeaderDesktop";
import styles from "./UserHeaderDesktop.module.css"
import { useEffect, useRef, useState } from "react";
import UserAvatar from "../../UserAvatar/UserAvatar";
import { useQueryClient } from "@tanstack/react-query";
import useClickOutside from "../../../hooks/useClickOutside";
import useModalClose from "../../../hooks/useModalClose";
import Skeleton from "react-loading-skeleton";
import type { UserType } from "../../../App";

type Props = {
  userName?: string;
  type: UserType;
  isLoading: boolean;
}

export default function UserHeaderDesktop({ userName, type, isLoading }: Props) {

  const [openHeaderModal, setOpenHeaderModal] = useState<boolean>(false);

  const { isClosing, handleAnimatedClose } = useModalClose({
    duration: 200,
    lockScroll: false,
    onClose: () => setOpenHeaderModal(false),
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['userImage'] });
  }, []);

  const userRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: userRef,
    callback: () => {
      if (openHeaderModal && !isClosing) {
        handleAnimatedClose();
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
            <div className={`${styles.navLinks} ${menuOpen ? styles.navOpen : ''}`}>
              {type === 'personal' && (
                <>
                  <NavLink to="/home" className={navLinkClass} onClick={handleNavClick}>Início</NavLink>
                  <NavLink to="/schedule" className={navLinkClass} onClick={handleNavClick}>Agenda</NavLink>
                  <NavLink to="/personal/check-schedule" className={navLinkClass} onClick={handleNavClick}>Solicitações</NavLink>
                  <NavLink to="/set-availability" className={navLinkClass} onClick={handleNavClick}>Disponibilidade</NavLink>
                  <NavLink to="/packages" className={navLinkClass} onClick={handleNavClick}>Pacotes</NavLink>
                  <NavLink to="/users" className={navLinkClass} onClick={handleNavClick}>Alunos</NavLink>
                </>
              )}

              {type === 'admin' || type === 'personal' && (
                <>
                  <NavLink to="/home" className={navLinkClass} onClick={handleNavClick}>Início</NavLink>
                  <NavLink to="/schedule" className={navLinkClass} onClick={handleNavClick}>Agenda</NavLink>
                  <NavLink to="/packages" className={navLinkClass} onClick={handleNavClick}>Pacotes</NavLink>
                  <NavLink to="/personal/check-schedule" className={navLinkClass} onClick={handleNavClick}>Solicitações</NavLink>
                  <NavLink to="/set-availability" className={navLinkClass} onClick={handleNavClick}>Disponibilidade</NavLink>
                  <NavLink to="/plans-history" className={navLinkClass} onClick={handleNavClick}>Histórico de compras</NavLink>
                  <NavLink to="/schedule-history" className={navLinkClass} onClick={handleNavClick}>Histórico de agendamentos</NavLink>
                  <NavLink to="/dashboard" className={navLinkClass} onClick={handleNavClick}>Dashboard</NavLink>
                </>
              )}

              {type === 'aluno' && (
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
          )}


        </nav>

        <div ref={userRef} className={styles.authLinks}>

          <div
            onClick={() => {
              if (openHeaderModal && !isClosing) {
                handleAnimatedClose();
              } else if (!openHeaderModal) {
                setOpenHeaderModal(true);
              }
            }}
            className={styles.userAvatarHeaderDesktop}
          >
            <UserAvatar
              userName={userName}
              useUsername
              useUserImage
              isLoading={isLoading}
              rightIcon={
                <ChevronDown
                  className={`${styles.avatarChevron} ${openHeaderModal && !isClosing ? styles.rotated : ''}`}
                  size={20}
                />
              }
            />
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
            <div className={`${styles.headerModalDesktop} ${isClosing ? styles.closing : ''}`}>
              <div className={styles.headerModalContentDesktop}>
                <Link onClick={handleAnimatedClose} to="/edit-user">
                  <User size={18} /> Editar perfil
                </Link>
                {type === "personal" &&
                  <Link onClick={handleAnimatedClose} to="/set-availability">
                    <Calendar size={18} /> Ajustar disponibilidade
                  </Link>
                }
                {type === "aluno" &&
                  <Link onClick={handleAnimatedClose} to="/edit-user/addresses">
                    <MapPin size={18} /> Endereços
                  </Link>
                }
                <div className={styles.divider} />
                <Link className={styles.logoutLink} onClick={handleAnimatedClose} to="/logout">
                  <LogOut size={18} /> Sair
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
