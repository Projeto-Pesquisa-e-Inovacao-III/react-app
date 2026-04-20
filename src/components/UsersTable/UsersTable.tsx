import SmallerButton from "../SmallerButton/SmallerButton";
import useMobile from "../../hooks/isMobile";
import { useNavigate } from "react-router-dom";
import styles from "./UsersTable.module.css";
import classNames from "classnames";
import UserAvatar from "../UserAvatar/UserAvatar";
import Skeleton from "react-loading-skeleton";
import type { ListStudents } from "../../models/students";

const normalizeString = (str?: string) => {
    return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};



export default function UsersTable(props: { users: ListStudents; input: string; isLoading: boolean }) {
    const isMobile = useMobile();

    const nav = useNavigate();

    function handleViewUserData(id: number, roles: string[]) {
        if (roles.some(role => role.toLowerCase() === "personal")) {
            nav("/users/view-personal-data?id=" + id);
        } else {
            nav("/users/view-user-data?id=" + id);
        }
    }

    function getAge(dateOfBirthString?: string) {
        if (!dateOfBirthString) return null;

        const today = new Date();
        const birthDate = new Date(dateOfBirthString);

        if (isNaN(birthDate.getTime())) return null;

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    return (
        <div className={classNames(styles.usersTableContainer, {
            [styles.usersTableContainerMobile]: isMobile
        })}>
            {props.isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={classNames(styles.usersTableCard, {
                        [styles.usersTableCardMobile]: isMobile
                    })}>
                        <div className={classNames(styles.userDataFull, {
                            [styles.userDataFullMobile]: isMobile
                        })}>
                            {/* <UserAvatar foto={user.caminhoFoto ? `${user.caminhoFoto}` : undefined} useUserImage={false} /> */}
                            <Skeleton circle={true} width={50} height={50} />
                            <div className={styles.userData}>
                                <b>
                                    <Skeleton width={200} baseColor="#d9d9d9" />
                                </b>
                                <span>
                                    <Skeleton width={100} baseColor="#d9d9d9" />
                                </span>
                            </div>
                        </div>
                        <div>
                            <Skeleton width={100} height={40} baseColor="#d9d9d9" />
                        </div>

                    </div>
                ))
            }

            {!props.isLoading && (props.users ?? [])
                .filter(user => user != null && normalizeString(user.nome).includes(normalizeString(props.input)))
                .map((user, index) => (
                    <div key={index} className={classNames(styles.usersTableCard, {
                        [styles.usersTableCardMobile]: isMobile
                    })}>
                        <div className={classNames(styles.userDataFull, {
                            [styles.userDataFullMobile]: isMobile
                        })}>
                            <UserAvatar userName={user.nome} foto={user.caminhoFoto ? `${user.caminhoFoto}` : undefined} useUserImage={false} />
                            <div className={styles.userData}>
                                <b>
                                    {user.nome ?? <Skeleton width={100} />}
                                </b>
                                <span>
                                    Idade: {user.idade ?? getAge(user.dataNascimento) ?? <Skeleton width={100} />}
                                </span>
                            </div>
                        </div>
                        <div>
                            <SmallerButton handleButtonClick={() => handleViewUserData(user.id, user.roles)} title="Ver Dados" />
                        </div>
                    </div>
                ))}
        </div>
    );
}
