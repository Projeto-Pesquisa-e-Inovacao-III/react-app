import { useMediaQuery } from "@mui/material";
import UserHeaderMobile from "../UserHeader/UserHeaderMobile/UserHeaderMobile";
import UserHeaderDesktop from "../UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { isAuthenticated } from "../../services/authService";
import { LogoHeaderMobile } from "../LogoHeaderMobile/LogoHeaderMobile";
import { TypeContext } from "../../App";

export default function Layout() {
    const isMobile = useMediaQuery("(max-width:1024px)");
    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;
    const isLogged = isAuthenticated();

    const nav = useNavigate();

    const type = useContext(TypeContext);

    // useEffect(() => {
    //     if (!isLogged) {
    //         nav("/login");
    //     }
    // }, []);


    return (
        <div>
            {/* {isLogged && ( */}
                <>
                    {!isMobile && <Header type={type} />}
                    {isMobile && <div className="logo_header_mobile">
                        <LogoHeaderMobile />
                    </div>}
                    <main className="layout_main_outlet"><Outlet /></main>
                    {isMobile && <Header type={type} />}
                </>
            {/* )} */}
        </div>
    )
}