import SmallerButton from "../SmallerButton";
import { useMediaQuery } from "@mui/material";
import useMobile from "../../hooks/isMobile";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../system";
import styles from "./UsersTable.module.css";
import classNames from "classnames";
import UserAvatar from "../UserAvatar/UserAvatar";

export default function UsersTable(props) {
    const isMobile = useMobile();

    const nav = useNavigate();

    function handleViewUserData(id: number) {
        nav("/users/view-user-data?id=" + id);
    }

    console.log("USERS TABLE PROPS:", props.users);

    return (
        <div className={classNames(styles.usersTableContainer, {
            [styles.usersTableContainerMobile]: isMobile
        })}>
            <div className={styles.usersTableHeader}>
                <h3 className={styles.h3}>Usuários</h3>
            </div>

            {props.users.filter(user => user.nome.toLowerCase().includes(props.input.toLowerCase()))
                .map((user, index) => (
                    <div key={index} className={classNames(styles.usersTableCard, {
                        [styles.usersTableCardMobile]: isMobile
                    })}>
                        <div className={classNames(styles.userDataFull, {
                            [styles.userDataFullMobile]: isMobile
                        })}>
                            <UserAvatar foto={user.caminhoFoto} />
                            <div className={styles.userData}>
                                <b>
                                    {user.nome}
                                </b>
                                <span>
                                    Idade: {user.idade}
                                </span>
                            </div>
                        </div>
                        <div>
                            <SmallerButton handleButtonClick={() => handleViewUserData(user.id)} title="Ver Dados"/>
                        </div>
                    </div>
                ))}
        </div>
    );
}
