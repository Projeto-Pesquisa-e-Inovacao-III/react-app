import { Link, NavLink } from "react-router-dom";
import { User, Calendar, LogOut, MapPin, ChevronDown, LayoutDashboard } from "lucide-react";
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
  type: UserType[] | null;
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
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `hover:text-gigant-orange transition-colors font-medium text-[15px] ${isActive ? 'text-gigant-orange' : 'text-white'}`;

  const menuOpen = false;


  return (
    <>
      <header className="w-full relative top-0 bg-oxford-blue/95 backdrop-blur-md text-white z-50 h-20 flex justify-center border-b border-white/10 shadow-lg">
        <div className="w-full px-24 flex items-center justify-between">
          <nav className="flex items-center gap-12 h-full">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <LogoHeaderDesktop />
            </Link>

            {isLoading && (
              <div className="flex gap-4">
                <Skeleton width={100} height={20} baseColor="#1e293b" highlightColor="#334155" />
                <Skeleton width={100} height={20} baseColor="#1e293b" highlightColor="#334155" />
                <Skeleton width={100} height={20} baseColor="#1e293b" highlightColor="#334155" />
              </div>
            )}

            {!isLoading && type && (
              <div className={`flex items-center gap-8 font-poppins ${menuOpen ? styles.navOpen : ''}`}>
                {type.includes('personal') && !type.includes('admin') && (
                  <>
                    <NavLink to="/home" className={navLinkClass}>Início</NavLink>
                    <NavLink to="/schedule" className={navLinkClass}>Agenda</NavLink>
                    <NavLink to="/personal/check-schedule" className={navLinkClass}>Solicitações</NavLink>
                    <NavLink to="/set-availability" className={navLinkClass}>Disponibilidade</NavLink>
                    <NavLink to="/packages" className={navLinkClass}>Pacotes</NavLink>
                    <NavLink to="/users" className={navLinkClass}>Alunos</NavLink>
                  </>
                )}

                {type.includes('admin') && (
                  <>
                    <NavLink to="/home" className={navLinkClass}>Início</NavLink>
                    <NavLink to="/schedule" className={navLinkClass}>Agenda</NavLink>
                    <NavLink to="/packages" className={navLinkClass}>Pacotes</NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                    <NavLink to="/personal/check-schedule" className={navLinkClass}>Solicitações</NavLink>
                    <NavLink to="/users" className={navLinkClass}>Usuários</NavLink>
                    <NavLink to="/create-personal" className={navLinkClass}>Criar personal</NavLink>
                  </>
                )}

                {type.includes('aluno') && (
                  <>
                    <NavLink to="/home" className={navLinkClass}>Início</NavLink>
                    <NavLink to="/schedule" className={navLinkClass}>Agenda</NavLink>
                    <NavLink to="/packages" className={navLinkClass}>Pacotes</NavLink>
                    <NavLink to="/plans-history" className={navLinkClass}>Histórico de compras</NavLink>
                    <NavLink to="/schedule-history" className={navLinkClass}>Histórico de agendamentos</NavLink>
                  </>
                )}
              </div>
            )}
          </nav>

          <div ref={userRef} className="flex items-center gap-6">
            <div
              onClick={() => {
                if (openHeaderModal && !isClosing) {
                  handleAnimatedClose();
                } else if (!openHeaderModal) {
                  setOpenHeaderModal(true);
                }
              }}
              className="cursor-pointer hover:bg-white/10 p-1.5 rounded-full transition-colors relative"
              style={{ position: 'relative' }}
            >
              <UserAvatar
                userName={userName}
                useUsername
                useUserImage
                isLoading={isLoading}
                rightIcon={
                  <ChevronDown
                    className={`transition-transform duration-300 ${openHeaderModal && !isClosing ? "rotate-180" : ""}`}
                    size={20}
                  />
                }
              />

              {openHeaderModal && (
                <div
                  className={`absolute top-[60px] right-0 bg-white rounded-xl shadow-2xl border border-black/5 w-64 z-50 origin-top-right
                    ${isClosing ? styles.modalLeave : styles.modalEnter}`}
                >
                  <div className="flex flex-col p-2">
                    <Link onClick={handleAnimatedClose} to="/edit-user" className="flex items-center gap-3 px-4 py-3 text-slate-600 text-[15px] font-medium rounded-lg hover:bg-slate-50 hover:text-oxford-blue transition-all">
                      <User size={20} className="text-oxford-blue" /> Editar perfil
                    </Link>
                    {(type?.includes("personal") || (type?.includes("admin") && type?.includes("personal"))) &&
                      <Link onClick={handleAnimatedClose} to="/set-availability" className="flex items-center gap-3 px-4 py-3 text-slate-600 text-[15px] font-medium rounded-lg hover:bg-slate-50 hover:text-oxford-blue transition-all">
                        <Calendar size={20} className="text-oxford-blue" /> Disponibilidade
                      </Link>
                    }
                    {type?.includes("aluno") &&
                      <Link onClick={handleAnimatedClose} to="/edit-user/addresses" className="flex items-center gap-3 px-4 py-3 text-slate-600 text-[15px] font-medium rounded-lg hover:bg-slate-50 hover:text-oxford-blue transition-all">
                        <MapPin size={20} className="text-oxford-blue" /> Endereços
                      </Link>
                    }
                    {type?.includes("admin") &&
                      <Link onClick={handleAnimatedClose} to="/no-code-tool" className="flex items-center gap-3 px-4 py-3 text-slate-600 text-[15px] font-medium rounded-lg hover:bg-slate-50 hover:text-oxford-blue transition-all">
                        <LayoutDashboard size={20} className="text-oxford-blue" /> Modificar site
                      </Link>
                    }
                    <div className="h-px bg-slate-100 my-1" />
                    <Link className="flex items-center gap-3 px-4 py-3 text-red-500 text-[15px] font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition-all" onClick={handleAnimatedClose} to="/logout">
                      <LogOut size={20} /> Sair
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
