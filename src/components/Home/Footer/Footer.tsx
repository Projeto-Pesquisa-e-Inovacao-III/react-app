import LinksCol from "./LinksCol";
import { LogoHeaderDesktop } from "../../LogoHeaderDesktop/LogoHeaderDesktop";

export default function Footer({ isMobile }: { isMobile: boolean }) {

    function handleNavigate(url: string) {
        window.open(url, "_blank");
    }

    const actualYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-oxford-blue text-white pt-16 pb-12">
            <div className={`w-full max-w-[1600px] mx-auto ${isMobile ? "px-6" : "px-16"}`}>
                <div className={`flex ${isMobile ? "flex-col gap-12" : "flex-row justify-between items-start mb-16"}`}>
                    
                    {/* Brand Section */}
                    <div className={`flex flex-col ${isMobile ? "items-center text-center" : "items-start text-left"} gap-6`}>
                        <div className="hover:opacity-80 transition-opacity cursor-pointer">
                             <LogoHeaderDesktop />
                        </div>
                        <p className={`text-gray-400 text-base leading-relaxed ${isMobile ? "max-w-xs" : "max-w-sm"}`}>
                            Consultoria Saúde Fitness: transformando vidas através do movimento com atendimento personalizado para todas as idades.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <div 
                                onClick={() => handleNavigate("https://www.instagram.com/fabiobernardes.oficial")} 
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-gigant-orange transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className={`grid ${isMobile ? "grid-cols-2 gap-8" : "grid-cols-3 gap-16"}`}>
                        <LinksCol 
                            title="Nossos serviços" 
                            firstPage={"/#about-section"} 
                            firstPageName={"Sobre mim"} 
                            secondPage={"/#plans-section"} 
                            secondPageName={"Pacotes"} 
                        />
                        <LinksCol 
                            title="Suporte" 
                            firstPage={"/#faq"} 
                            firstPageName={"FAQ"} 
                            secondPage={"https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F"} 
                            secondPageBlank={true} 
                            secondPageName={"Contato"} 
                        />
                        <LinksCol 
                            title="Legal" 
                            firstPage={"/link"} 
                            firstPageName={"Termos de uso"} 
                        />
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>&copy; {actualYear} CSF Treinamentos. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
