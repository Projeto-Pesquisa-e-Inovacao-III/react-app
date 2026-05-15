import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function PackageSuccess() {

    const nav = useNavigate();

    useEffect(() => {
        nav("/packages", {
            replace: true,
            state: {
                successMessage: true,
            }
        });
    }, [nav]);

    return null;
}
