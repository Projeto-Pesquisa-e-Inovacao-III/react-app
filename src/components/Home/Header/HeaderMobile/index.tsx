import { useState } from "react";
import { LogoHeaderMobile } from "../../../LogoHeaderMobile";
import { Link } from "react-router";

export default function HeaderMobile({ userLoggedIn }: { userLoggedIn: boolean }) {

  const [burgerActive, setBurgerActive] = useState(false);


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
          <nav className="flex absolute top-20 left-0 w-full flex-col bg-white p-7 border-b">
            <a href="#main-section-mobile">Inicio</a>
            <a href="#about-section-mobile">Quem sou?</a>
            <a href="#services-section-mobile">Bora treinar!</a>
            <a href="#plans-section">Pacotes de Consultoria</a>

            {userLoggedIn ? (
              <>
                <Link to="/home" className=" bg-white text-black h-full rounded-md">Perfil</Link>
                <Link to="/logout" className=" bg-white text-black h-full rounded-md">Logout</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="mt-5 h-full rounded-md">Login</Link>
                <Link to="/register" className=" bg-white text-black h-full rounded-md">Cadastro</Link>
              </>
            )}
          </nav>
        )}
      </header>
    </>
  );
}
