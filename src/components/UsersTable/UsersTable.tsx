import "./style.css"
import "./mobile.css"
import SmallerButton from "../SmallerButton";
import { useMediaQuery } from "@mui/material";
import useMobile from "../../hooks/isMobile";
import { useNavigate } from "react-router-dom";

export default function UsersTable(props){
    const isMobile = useMobile();

    const users = [
        {
            name: "Ana Silva",
            idade: "60 anos"
        },
        {
            name: "Carlos Mendes",
            idade: "45 anos"
        },
    ];

    const nav = useNavigate();

    function handleViewUserData(){
        nav("/users/view-user-data");
    }


     return (
        <div className={`users-table-container${isMobile ? "-mobile" : ""}`}>
            <div className="users-table-header">
                <h3 className={"h3"}>Usuários</h3>
            </div>

            {users.filter(user => user.name.toLowerCase().includes(props.input.toLowerCase()))
                .map((user, index) => (
                    <div key={index} className={`users-table-card${isMobile ? "-mobile" : ""}`}>
                        <div className={`user-data-full${isMobile ? "-mobile" : ""}`}>
                            <img
                                className="user-image"
                                src="https://placehold.co/50x50/png"
                                alt=""
                            />
                            <div className="user-data">
                                <b>
                                    {user.name}
                                </b>
                                <span>
                                    Idade: {user.idade}
                                </span>
                            </div>
                        </div>
                        <div>
                            <SmallerButton handleButtonClick={handleViewUserData} title="Ver Dados"/>
                        </div>
                    </div>
                ))}
        </div>
    );
}
