import classNames from "classnames";
import SmallerButton from "../../../components/SmallerButton";
import useMobile from "../../../hooks/isMobile";
import styles from "./ViewUserData.module.css";
import { useState } from "react";
import Input from "../../../components/Inputs/Input/Input";
import Select from "../../../components/Inputs/Select";

export default function ViewUserData() {
    const isMobile = useMobile();

    const [openModalCreateTraining, setOpenModalCreateTraining] = useState(false);
    const [trainingDay, setTrainingDay] = useState("");

    return (
        <>
            <div className={classNames(styles.container, { [styles.containerMobile]: isMobile })}>
                <div className={styles.content}>
                    <div className={styles.title}>
                        <h1>Dados</h1>
                    </div>
                    <div className={styles.userDetails}>
                        <img src="https://thispersondoesnotexist.com/" alt="" />
                        <div className={styles.wrapperInfos}>
                            <div className={styles.info}>
                                <p><strong>Nome: </strong><span>João Silva</span></p>
                                <p><strong>Idade: </strong><span> 30</span></p>
                            </div>
                            <div className={styles.info}>
                                <p><strong>Email: </strong><span> joao.silva@example.com</span></p>
                                <p><strong>Endereco: </strong><span> Rua das Flores, 123</span></p>
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