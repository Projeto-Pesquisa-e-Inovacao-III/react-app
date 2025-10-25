import { LogoHeaderDesktop } from "../../../LogoHeaderDesktop";

export default function HeaderDesktop() {

    return (
        <>
            <header className="w-full fixed bg-indigo flex items-center justify-center h-20 p-[20px] pl-25 pr-25 text-white">
                <div>
                    <LogoHeaderDesktop />
                </div>
                <nav className="font-poppins text-lg font-semibold mt-0 mb-0 ml-auto mr-auto flex items-center justify-center gap-10 ">
                    <a href="#main-section">Inicio</a>
                    <a href="#about-section">Quem sou?</a>
                    <a href="#services-section">Bora treinar!</a>
                    <a href="#plans-section">Pacotes de Consultoria</a>
                </nav>

                <div className="text-lg flex gap-2">
                    <a href="/login" className="p-3 text-white h-full rounded-md">Login</a>
                    <a href="/register" className=" p-3 bg-white text-black h-full rounded-md">Cadastro</a>
                </div>
            </header>
        </>
    );
}
