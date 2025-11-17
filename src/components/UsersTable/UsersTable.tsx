import "./style.css"
import "./mobile.css"
import SmallerButton from "../SmallerButton";
import { useMediaQuery } from "@mui/material";
import useMobile from "../../hooks/isMobile";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../system";

export default function UsersTable(props) {
    const isMobile = useMobile();

    const nav = useNavigate();

    function handleViewUserData() {
        nav("/users/view-user-data");
    }


    return (
        <div className={`users-table-container${isMobile ? "-mobile" : ""}`}>
            <div className="users-table-header">
                <h3 className={"h3"}>Usuários</h3>
            </div>

            {props.users.filter(user => user.nome.toLowerCase().includes(props.input.toLowerCase()))
                .map((user, index) => (
                    <div key={index} className={`users-table-card${isMobile ? "-mobile" : ""}`}>
                        <div className={`user-data-full${isMobile ? "-mobile" : ""}`}>
                            {user.caminhoFoto ? (
                                <img
                                    className="user-image"
                                    src={`${BASE_URL}/usuarios/foto/${user.caminhoFoto}`}
                                    alt={user.nome}
                                />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            )}

                            <div className="user-data">
                                <b>
                                    {user.nome}
                                </b>
                                <span>
                                    Idade: {user.idade}
                                </span>
                            </div>
                        </div>
                        <div>
                            <SmallerButton handleButtonClick={handleViewUserData} title="Ver Dados" />
                        </div>
                    </div>
                ))}
        </div>
    );
}
