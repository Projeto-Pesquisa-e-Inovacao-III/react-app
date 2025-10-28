import { useMediaQuery } from "@mui/material";
import UserHeaderMobile from "../UserHeader/UserHeaderMobile/UserHeaderMobile";
import UserHeaderDesktop from "../UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../../services/authService";
import { LogoHeaderMobile } from "../LogoHeaderMobile/LogoHeaderMobile";
type LayoutProps = {
    type: "student" | "personal";
    changeTypeTo: React.Dispatch<React.SetStateAction<"personal" | "student">>;
}

export default function Layout({ type, changeTypeTo }: LayoutProps) {
    const isMobile = useMediaQuery("(max-width:1024px)");
    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;
    const isLogged = isAuthenticated();

    const nav = useNavigate();

    useEffect(() => {
        if (!isLogged) {
            nav("/login");
        }
    }, []);


    return (
        <div>
            {isLogged && (
                <>
                    {!isMobile && <Header typeState={changeTypeTo} type={type} />}
                    {isMobile && <div className="logo_header_mobile">
                        <LogoHeaderMobile />
                    </div>}
                    <main><Outlet /></main>
                    {isMobile && <Header typeState={changeTypeTo} type={type} />}
                </>
            )}
        </div>
    )
}