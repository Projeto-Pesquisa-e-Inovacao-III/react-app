import classNames from "classnames";
import SmallerButton from "../../../components/SmallerButton";
import useMobile from "../../../hooks/isMobile";
import styles from "./ViewUserData.module.css";

export default function ViewUserData() {
    const isMobile = useMobile();
    return (
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
                        <SmallerButton title="Criar treinamento" />
                    </div>
                </div>

            </div>
        </div >
    );
}