import classNames from "classnames";
import SmallerButton from "../../../components/SmallerButton";
import useMobile from "../../../hooks/isMobile";
import styles from "./ViewUserData.module.css";
import { useState } from "react";
import Input from "../../../components/Inputs/Input/Input";
import Select from "../../../components/Inputs/Select/Select";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getById } from "../../../constants/user";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";
import { differenceInYears, parse } from "date-fns";

export default function ViewUserData() {
    const isMobile = useMobile();

    const [openModalCreateTraining, setOpenModalCreateTraining] = useState(false);
    const [trainingDay, setTrainingDay] = useState("");

    const [params] = useSearchParams();

    const user = useQuery({
        queryKey: ['userData', params.get("id")],
        queryFn: () => getById(params.get("id") || ""),
        enabled: !!params.get("id"),
        select: (res) => res.data,
    });
    console.log(user.data)

    return (
        <>
            <div className={classNames(styles.container, { [styles.containerMobile]: isMobile })}>
                <div className={styles.content}>
                    <div className={styles.title}>
                        <h1>Dados</h1>
                    </div>
                    <div className={styles.userDetails}>
                        <UserAvatar foto={user.data?.caminhoFoto} />
                        <div className={styles.wrapperInfos}>
                            <div className={styles.info}>
                                <p><strong>Nome: </strong><span>{user.data?.nome}</span></p>
                                <p><strong>Idade: </strong><span> {user.data?.dataNascimento ? differenceInYears(new Date(), parse(user.data?.dataNascimento, "yyyy-MM-dd", new Date())) : "N/A"}</span></p>
                            </div>
                            <div className={styles.info}>
                                <p><strong>Email: </strong><span> {user.data?.email}</span></p>
                                <p><strong>Telefone: </strong><span> {user.data?.telefones[0].numeroCompleto}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}