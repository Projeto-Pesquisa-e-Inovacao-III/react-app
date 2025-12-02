import { Link } from "react-router-dom";
import { LogoHeaderDesktop } from "../../../LogoHeaderDesktop/LogoHeaderDesktop";
import UserAvatar from "../../../UserAvatar/UserAvatar";

export default function HeaderDesktop({ userLoggedIn }: { userLoggedIn: boolean }) {

    return (
        <>
            <header className="w-full fixed bg-indigo flex items-center justify-center h-20 p-[20px] pl-25 pr-25 text-white">
                <Link to="/">
                    <LogoHeaderDesktop />
                </Link>
                <nav className="font-poppins text-lg font-semibold mt-0 mb-0 ml-auto mr-auto flex items-center justify-center gap-10 ">
                    <a href="#main-section">Inicio</a>
                    <a href="#about-section">Quem sou?</a>
                    <a href="#services-section">Bora treinar!</a>
                    <a href="#plans-section">Pacotes de Consultoria</a>
                </nav>

                <div className="text-lg flex gap-2">
                    {userLoggedIn ? (
                        <div className="flex gap-3 items-center">
                            <Link to="/home" className="border-2 p-1 rounded-full">
                                <UserAvatar useUserImage={true} />
                            </Link>
                            <Link to="/logout" className="p-3 bg-white text-black h-auto rounded-md">Logout</Link>

                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="p-3 text-white h-full rounded-md">Login</Link>
                            <Link to="/register" className=" p-3 bg-white text-black h-full rounded-md">Cadastro</Link>
                        </>
                    )}
                </div>
            </header>
        </>
    );
}
