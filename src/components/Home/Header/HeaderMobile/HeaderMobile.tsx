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
      <header className="w-full bg-white text-black h-20 px-5 flex items-center justify-between border-b border-[#eee] shadow-sm">
        <div 
          className={styles.burgerButton}
          onClick={handleToggle}
        >
          <div className={classNames(styles.bar, { [styles.barActive]: burgerActive })}></div>
          <div className={classNames(styles.bar, { [styles.barActive]: burgerActive })}></div>
          <div className={classNames(styles.bar, { [styles.barActive]: burgerActive })}></div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <LogoHeaderMobile />
        </div>
        <div className="flex items-center">
          {verify ? (
            <Link to="/home" className="border border-gray-200 rounded-full overflow-hidden">
              <UserAvatar userName={userName} useUsername={false} useUserImage={true} />
            </Link>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-md bg-indigo text-white text-sm font-semibold hover:bg-[#2c6888] transition-colors">
              Entrar
            </Link>
          )}
        </div>
      </header>

      {burgerActive && (
        <nav className={classNames(
          "absolute top-full left-0 w-full bg-white text-[#1E1E1E] shadow-xl border-t border-[#eee] flex flex-col overflow-y-auto max-h-[calc(100vh-5rem)]",
          styles.dropdown,
          { [styles.dropdownClosing]: isClosing }
        )}>
          {verify && (
            <div className="bg-[#051128] text-white p-5 flex items-center gap-3">
              <div className="bg-[#ffffff20] p-2 rounded-full">
                <User size={20} />
              </div>
              <span className="font-bold text-lg">
                Olá, {userName.split(' ')[0]}
              </span>
            </div>
          )}

          <div className="flex flex-col py-2">
            <a href="#main-section" onClick={handleAnimatedClose} className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors">
              Inicio
            </a>
            <a href="#about-section" onClick={handleAnimatedClose} className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors">
              Quem sou?
            </a>
            <a href="#services-section" onClick={handleAnimatedClose} className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors">
              Bora treinar!
            </a>
            <a href="#plans-section" onClick={handleAnimatedClose} className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors">
              Pacotes de Consultoria
            </a>
            
            {!verify ? (
              <Link to="/register" onClick={handleAnimatedClose} className="px-6 py-4 text-[#F26430] font-bold hover:bg-gray-50 transition-colors">
                Cadastre-se agora
              </Link>
            ) : (
              <Link to="/logout" onClick={handleAnimatedClose} className="px-6 py-4 text-red-500 hover:bg-gray-50 transition-colors">
                Sair
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
