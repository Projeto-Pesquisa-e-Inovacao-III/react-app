import { useState } from "react";
import { LogoHeaderMobile } from "../../../LogoHeaderMobile/LogoHeaderMobile";
import { Link } from "react-router";
import { isAuthenticated } from "../../../../constants/user";
import { useQuery } from "@tanstack/react-query";

export default function HeaderMobile() {

  const [burgerActive, setBurgerActive] = useState(false);
  const userLoggedIn = useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: isAuthenticated,
  });

  const verify = !!userLoggedIn.data?.data?.autentificado;

  return (
    <>
      <header className="flex justify-between items-center border-b h-20 p-[20px]">
        <div>
          <LogoHeaderMobile />
        </div>

        <div className="h-6 flex flex-col justify-between cursor-pointer" onClick={() => setBurgerActive(!burgerActive)}>
          <div className="border-2 w-7"></div>
          <div className="border-2 w-7"></div>
          <div className="border-2 w-7"></div>
        </div>

        {burgerActive && (
          <nav className="z-10 flex absolute top-20 left-0 w-full flex-col bg-white p-7 border-b">
            <a href="#main-section-mobile">Inicio</a>
            <a href="#about-section-mobile">Quem sou?</a>
            <a href="#services-section-mobile">Bora treinar!</a>
            <a href="#plans-section">Pacotes de Consultoria</a>

            {verify ? (
              <>
                <Link to="/home" className=" bg-white text-black h-full rounded-md">Perfil</Link>
                <Link to="/logout" className=" bg-white text-black h-full rounded-md">Sair</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="mt-5 h-full rounded-md">Entrar</Link>
                <Link to="/register" className=" bg-white text-black h-full rounded-md">Cadastro</Link>
              </>
            )}
          </nav>
        )}
      </header>
    </>
  );
}
