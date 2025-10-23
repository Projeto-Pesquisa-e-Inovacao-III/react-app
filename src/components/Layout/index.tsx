import { useMediaQuery } from "@mui/material";
import UserHeaderMobile from "../UserHeader/UserHeaderMobile/UserHeaderMobile";
import UserHeaderDesktop from "../UserHeader/UserHeaderDesktop/UserHeaderDesktop";
export default function Layout({ children, type, hasHeader = true }: { children: React.ReactNode; type: "student" | "personal"; hasHeader?: boolean }) {
    const isMobile = useMediaQuery("(max-width:1024px)");
    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;

    return (
        <div>
            {!isMobile && hasHeader && <Header type={type} />}
            <main>{children}</main>
            {isMobile && hasHeader && <Header type={type} />}

        </div>
    )
}