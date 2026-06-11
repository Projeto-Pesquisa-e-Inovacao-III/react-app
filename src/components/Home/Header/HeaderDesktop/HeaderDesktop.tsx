import { Link } from "react-router-dom";
import { LogoHeaderDesktop } from "../../../LogoHeaderDesktop/LogoHeaderDesktop";
import UserAvatar from "../../../UserAvatar/UserAvatar";
import { useQuery } from "@tanstack/react-query";
import { isAuthenticated } from "../../../../constants/user";
import { useRef, useState } from "react";
import { ChevronDown, Home, LogOut } from "lucide-react";
import useClickOutside from "../../../../hooks/useClickOutside";
import useModalClose from "../../../../hooks/useModalClose";

export default function HeaderDesktop() {
    const userLoggedIn = useQuery({
        queryKey: ["isAuthenticated"],
        queryFn: isAuthenticated,
    });

    const verify = !!userLoggedIn.data?.data?.autentificado;
    const userName = userLoggedIn.data?.data?.user?.nome || "Usuário";

    const [openModal, setOpenModal] = useState<boolean>(false);

    const { isClosing, handleAnimatedClose } = useModalClose({
        duration: 200,
        lockScroll: false,
        onClose: () => setOpenModal(false),
    });

    const avatarRef = useRef<HTMLDivElement>(null);

    useClickOutside({
        ref: avatarRef,
        callback: () => {
            if (openModal && !isClosing) {
                handleAnimatedClose();
            }
        },
    });

    return (
        <>
            <header className="w-full fixed bg-indigo flex items-center justify-center h-20 p-[20px] pl-25 pr-25 text-white z-10 sticky top-0">
                <Link to="/">
                    <LogoHeaderDesktop />
                </Link>
                <nav className="font-poppins text-lg font-semibold mt-0 mb-0 ml-auto mr-auto flex items-center justify-center gap-10">
                    <a href="#main-section">Inicio</a>
                    <a href="#about-section">Quem sou?</a>
                    <a href="#services-section">Bora treinar!</a>
                    <a href="#plans-section">Pacotes de Consultoria</a>
                    <Link to="/dev-seed" className="border border-white">dev/seed</Link>
                </nav>

                <div className="text-lg flex gap-2">
                    {verify ? (
                        <div ref={avatarRef} className="relative flex gap-3 items-center">
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    if (openModal && !isClosing) {
                                        handleAnimatedClose();
                                    } else if (!openModal) {
                                        setOpenModal(true);
                                    }
                                }}
                            >
                                <UserAvatar
                                    userName={userName}
                                    useUsername
                                    useUserImage
                                    rightIcon={
                                        <ChevronDown
                                            size={30}
                                            className={`text-white transition-transform duration-300 ${openModal && !isClosing ? "rotate-180" : ""}`}
                                        />
                                    }
                                />
                            </div>

                            {openModal && (
                                <div
                                    className={`absolute top-[60px] right-0 bg-white rounded-xl shadow-xl border border-black/5 w-52 z-50
                                        origin-top-right
                                        ${isClosing
                                            ? "animate-[modalLeave_0.2s_ease-in_forwards]"
                                            : "animate-[modalEnter_0.2s_ease-out_forwards]"
                                        }`}
                                    style={{
                                        animation: isClosing
                                            ? "modalLeave 0.2s ease-in forwards"
                                            : "modalEnter 0.2s ease-out forwards",
                                    }}
                                >
                                    <style>{`
                                        @keyframes modalEnter {
                                            from { opacity: 0; transform: scale(0.95) translateY(-10px); }
                                            to   { opacity: 1; transform: scale(1)    translateY(0);     }
                                        }
                                        @keyframes modalLeave {
                                            from { opacity: 1; transform: scale(1)    translateY(0);     }
                                            to   { opacity: 0; transform: scale(0.95) translateY(-10px); }
                                        }
                                    `}</style>
                                    <div className="flex flex-col p-2">
                                        <Link
                                            onClick={handleAnimatedClose}
                                            to="/home"
                                            className="flex items-center gap-3 px-4 py-3 text-[#334155] text-[15px] font-medium rounded-lg no-underline hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
                                        >
                                            <Home size={18} /> Visão geral
                                        </Link>
                                        <div className="h-px bg-slate-200 my-2" />
                                        <Link
                                            onClick={handleAnimatedClose}
                                            to="/logout"
                                            className="flex items-center gap-3 px-4 py-3 text-red-500 text-[15px] font-medium rounded-lg no-underline hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                        >
                                            <LogOut size={18} /> Sair
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="p-3 text-white h-full rounded-md">Entrar</Link>
                            <Link to="/register" className="p-3 bg-white text-black h-full rounded-md">Cadastro</Link>
                        </>
                    )}
                </div>
            </header>
        </>
    );
}
