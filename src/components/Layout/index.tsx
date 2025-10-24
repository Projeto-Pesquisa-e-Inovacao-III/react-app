import { useMediaQuery } from "@mui/material";
import UserHeaderMobile from "../UserHeader/UserHeaderMobile/UserHeaderMobile";
import UserHeaderDesktop from "../UserHeader/UserHeaderDesktop/UserHeaderDesktop";
export default function Layout({ children, type, changeTypeTo, hasHeader = false }: { children: React.ReactNode; type: "student" | "personal"; changeTypeTo: React.Dispatch<React.SetStateAction<"personal" | "student">>; hasHeader?: boolean }) {
    const isMobile = useMediaQuery("(max-width:1024px)");
    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;

    return (
        <div>
            {!isMobile && hasHeader && <Header typeState={changeTypeTo} type={type} />}
            <main>{children}</main>
            {isMobile && hasHeader && <Header type={type} />}

        </div>
    )
}