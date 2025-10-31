import UserHeaderMobile from "../UserHeader/UserHeaderMobile/UserHeaderMobile";
import UserHeaderDesktop from "../UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { isAuthenticated } from "../../services/authService";
import { LogoHeaderMobile } from "../LogoHeaderMobile/LogoHeaderMobile";
import { TypeContext } from "../../App";
import useMobile from "../../hooks/isMobile";

export default function Layout() {
    const isMobile = useMobile();
    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;
    const isLogged = isAuthenticated();

    const nav = useNavigate();

    const type = useContext(TypeContext);

    const location = useLocation();

    const hideLogoPaths = ["/more-options"].includes(location.pathname);

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
                    {isMobile && !hideLogoPaths && <div className="logo_header_mobile">
                        <LogoHeaderMobile />
                    </div>}
                    <main className={`${!hideLogoPaths ? "layout_main_outlet" : ""}`}><Outlet /></main>
                    {isMobile && <Header type={type} />}
                </>
            {/* )} */}
        </div>
    )
}