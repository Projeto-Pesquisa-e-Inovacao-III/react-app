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
            <header className="w-full fixed top-0 bg-oxford-blue/95 backdrop-blur-md text-white z-50 h-20 flex justify-center border-b border-white/10">
                <div className="w-full max-w-[1600px] px-16 flex items-center justify-between">
                    <Link to="/" className="hover:opacity-80 transition-opacity">
                        <LogoHeaderDesktop />
                    </Link>
                    
                    <nav className="font-poppins text-[15px] font-medium flex items-center gap-10">
                        <a href="#main-section" className="hover:text-gigant-orange transition-colors">Inicio</a>
                        <a href="#about-section" className="hover:text-gigant-orange transition-colors">Quem sou?</a>
                        <a href="#services-section" className="hover:text-gigant-orange transition-colors">Bora treinar!</a>
                        <a href="#plans-section" className="hover:text-gigant-orange transition-colors">Pacotes de Consultoria</a>
                    </nav>

                    <div className="flex items-center gap-6">
                        {verify ? (
                            <div ref={avatarRef} className="relative flex gap-3 items-center">
                                <div
                                    className="cursor-pointer hover:bg-white/10 p-1.5 rounded-full transition-colors"
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
                                                size={20}
                                                className={`text-white transition-transform duration-300 ${openModal && !isClosing ? "rotate-180" : ""}`}
                                            />
                                        }
                                    />
                                </div>

                                {openModal && (
                                    <div
                                        className={`absolute top-[60px] right-0 bg-white rounded-xl shadow-2xl border border-black/5 w-64 z-50
                                            origin-top-right
                                            ${isClosing
                                                ? "animate-[modalLeave_0.2s_ease-in_forwards]"
                                                : "animate-[modalEnter_0.2s_ease-out_forwards]"
                                            }`}
                                    >
                                        <div className="flex flex-col p-2">
                                            <Link
                                                onClick={handleAnimatedClose}
                                                to="/home"
                                                className="flex items-center gap-3 px-4 py-3 text-[#334155] text-[15px] font-medium rounded-lg no-underline hover:bg-slate-50 hover:text-oxford-blue transition-all duration-200"
                                            >
                                                <Home size={22} className="text-oxford-blue" /> Visão geral
                                            </Link>
                                            <div className="h-px bg-slate-100 my-1" />
                                            <Link
                                                onClick={handleAnimatedClose}
                                                to="/logout"
                                                className="flex items-center gap-3 px-4 py-3 text-red-500 text-[15px] font-medium rounded-lg no-underline hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                            >
                                                <LogOut size={22} /> Sair
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="px-4 py-2 text-[15px] font-bold text-white hover:text-gigant-orange transition-colors">
                                    Entrar
                                </Link>
                                <Link to="/register" className="px-6 py-2.5 bg-gigant-orange text-white text-[15px] font-bold rounded-lg hover:bg-orange-600 transition-all shadow-lg shadow-gigant-orange/20">
                                    Cadastro
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

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
            </header>
        </>
    );
}
