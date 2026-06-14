import { useState, useRef } from "react";
import { LogoHeaderMobile } from "../../../LogoHeaderMobile/LogoHeaderMobile";
import { Link } from "react-router-dom"; 
import { isAuthenticated } from "../../../../constants/user";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import UserAvatar from "../../../UserAvatar/UserAvatar";
import useModalClose from "../../../../hooks/useModalClose";
import useClickOutside from "../../../../hooks/useClickOutside";
import styles from "./HeaderMobile.module.css";
import classNames from "classnames";

export default function HeaderMobile() {
  const [burgerActive, setBurgerActive] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const userLoggedIn = useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: isAuthenticated,
  });

  const { isClosing, handleAnimatedClose } = useModalClose({
    onClose: () => setBurgerActive(false),
    duration: 300,
    lockScroll: false,
  });

  useClickOutside({
    ref: headerRef,
    callback: () => {
      if (burgerActive && !isClosing) {
        handleAnimatedClose();
      }
    },
    disabled: !burgerActive
  });

  const verify = !!userLoggedIn.data?.data?.autentificado;
  const userName = userLoggedIn.data?.data?.user?.nome || "Usuário";

  const handleToggle = () => {
    if (burgerActive) {
      handleAnimatedClose();
    } else {
      setBurgerActive(true);
    }
  };

  return (
    <div ref={headerRef} className="sticky top-0 z-50">
      <header className="w-full bg-oxford-blue/90 backdrop-blur-md text-white h-20 px-6 flex items-center justify-between border-b border-white/10 shadow-lg">
        <div 
          className={classNames(styles.burgerButton, "!text-white")}
          onClick={handleToggle}
        >
          <div className={classNames(styles.bar, "bg-white", { [styles.barActive]: burgerActive })}></div>
          <div className={classNames(styles.bar, "bg-white", { [styles.barActive]: burgerActive })}></div>
          <div className={classNames(styles.bar, "bg-white", { [styles.barActive]: burgerActive })}></div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <LogoHeaderMobile />
        </div>
        <div className="flex items-center">
          {verify ? (
            <Link to="/home" className="border border-white/20 rounded-full overflow-hidden">
              <UserAvatar userName={userName} useUsername={false} useUserImage={true} />
            </Link>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-lg bg-gigant-orange text-white text-sm font-bold shadow-lg shadow-gigant-orange/20">
              Entrar
            </Link>
          )}
        </div>
      </header>

      {burgerActive && (
        <nav className={classNames(
          "absolute top-full left-0 w-full bg-oxford-blue text-white shadow-2xl border-t border-white/10 flex flex-col overflow-y-auto max-h-[calc(100vh-5rem)]",
          styles.dropdown,
          { [styles.dropdownClosing]: isClosing }
        )}>
          {verify && (
            <div className="bg-white/5 text-white p-6 flex items-center gap-3 border-b border-white/10">
              <div className="bg-white/10 p-2.5 rounded-full">
                <User size={22} />
              </div>
              <span className="font-bold text-lg">
                Olá, {userName.split(' ')[0]}
              </span>
            </div>
          )}

          <div className="flex flex-col py-4">
            <a href="#main-section" onClick={handleAnimatedClose} className="px-8 py-4 border-b border-white/5 hover:bg-white/5 active:bg-white/10 transition-colors">
              Inicio
            </a>
            <a href="#about-section" onClick={handleAnimatedClose} className="px-8 py-4 border-b border-white/5 hover:bg-white/5 active:bg-white/10 transition-colors">
              Quem sou?
            </a>
            <a href="#services-section" onClick={handleAnimatedClose} className="px-8 py-4 border-b border-white/5 hover:bg-white/5 active:bg-white/10 transition-colors">
              Bora treinar!
            </a>
            <a href="#plans-section" onClick={handleAnimatedClose} className="px-8 py-4 border-b border-white/5 hover:bg-white/5 active:bg-white/10 transition-colors">
              Pacotes de Consultoria
            </a>
            
            {!verify ? (
              <Link to="/register" onClick={handleAnimatedClose} className="px-8 py-5 text-gigant-orange font-black text-lg hover:bg-white/5 transition-colors">
                CADASTRE-SE AGORA
              </Link>
            ) : (
              <Link to="/logout" onClick={handleAnimatedClose} className="px-8 py-5 text-red-400 font-bold hover:bg-white/5 transition-colors">
                Sair da conta
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
