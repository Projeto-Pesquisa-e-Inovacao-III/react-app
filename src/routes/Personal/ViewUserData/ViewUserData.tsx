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
                        <UserAvatar foto={user.data?.foto}/>
                        <div className={styles.wrapperInfos}>
                            <div className={styles.info}>
                                <p><strong>Nome: </strong><span>{user.data?.nome}</span></p>
                                <p><strong>Idade: </strong><span> {user.data?.idade}</span></p>
                            </div>
                            <div className={styles.info}>
                                <p><strong>Email: </strong><span> {user.data?.email}</span></p>
                                <p><strong>Telefone: </strong><span> {user.data?.telefones[0].numeroCompleto}</span></p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.plans}>
                        <div className={styles.title}>
                            <h1>Planos de treinamento</h1>
                        </div>
                        <div className={classNames(styles.btnCreateTraining, { [styles.btnCreateTrainingMobile]: isMobile })}>
                            <SmallerButton title="Criar treinamento" handleButtonClick={() => setOpenModalCreateTraining(true)} />
                        </div>
                    </div>
                </div>
            </div>
            {openModalCreateTraining && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Criar Treinamento</h2>
                        <form>
                            <Select
                                onInputChange={setTrainingDay}
                                placeholder="Dia do treinamento"
                                id="trainingType"
                                name="trainingType"
                                label="Dia:"
                                options={["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]} className={styles.select}
                            />
                            <div className={styles.textareaDescription}>
                                <label htmlFor="trainingDescription">Descrição:</label>
                                <textarea id="trainingDescription" name="trainingDescription" required></textarea>
                            </div>
                            <div className={styles.wrapperButtons}>
                                <SmallerButton type="submit" title="Criar" handleButtonClick={() => {}} />
                                <SmallerButton type="button" title="Cancelar" handleButtonClick={() => setOpenModalCreateTraining(false)} />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}