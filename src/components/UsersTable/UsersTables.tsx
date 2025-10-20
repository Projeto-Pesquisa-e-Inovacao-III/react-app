import { useMediaQuery } from "@mui/material";
import "./style.css"
import "./mobile.css"
import SmallerButton from "../SmallerButton";

export default function UsersTable(props){
    const isMobile = useMediaQuery("(max-width:1024px)");

    const users = [
        {
            name: "Ana Silva",
            idade: "60 anos"
        },
        {
            name: "Carlos Mendes",
            idade: "45 anos"
        },
        {
            name: "Juliana Rocha",
            idade: "32 anos"
        }
    ];

     return (
        <div className={`${isMobile ? "" : "users-table-container"}`}>
            <div className="users-table-header">
                <h3 className={`h3${isMobile ? "-mobile" : ""}`}>Usuários</h3>
            </div>

            {/* Desktop*/}
            {!isMobile && (
                <table className="table">
                    <tbody>
                        {users.filter(user => user.name.toLowerCase().includes(props.input.toLowerCase()))
                        .map((user, index) => (
                            <tr key={index}>
                                <td className="td-user">
                                    <img
                                        className="user-image"
                                        src="https://placehold.co/50x50/png"
                                        alt=""
                                    />
                                    {user.name}<br />
                                    Idade: {user.idade}
                                </td>
                                <td>
                                    <SmallerButton title="Ver Dados"/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Mobile*/}
            {isMobile &&
                users.filter(user => user.name.toLowerCase().includes(props.input.toLowerCase()))
                .map((user, index) => (
                    <div key={index} className="card-mobile">
                        <div>
                            <img
                                className="user-image"
                                src="https://placehold.co/50x50/png"
                                alt=""
                            />
                            <br />
                            {user.name}
                            <br />
                            Idade: {user.idade}
                        </div>
                        <div>
                            <SmallerButton title="Ver Dados"/>
                        </div>
                    </div>
                ))}
        </div>
    );
}
