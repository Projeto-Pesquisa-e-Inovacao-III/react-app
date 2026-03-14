
import TextWithoutPlan from '../TextWithoutPlan'
import SmallerButton from '../../SmallerButton/SmallerButton'
import { ShoppingBag } from 'lucide-react'
import styles from "./CardWithoutPlan.module.css"
import { useNavigate } from 'react-router-dom'

export default function CardWithoutPlan() {
    const nav = useNavigate()
    return (
        <section className={styles.card}>
            <div className={styles.cardBgIcon}>
                <svg width="129" height="135" viewBox="0 0 129 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M90.2383 158.117L79.0584 146.937L107.408 118.588L39.5292 50.7096L11.18 79.0588L0 67.8788L11.18 56.2996L0 45.1196L16.77 28.3496L5.58999 16.7704L16.77 5.59041L28.3492 16.7704L45.1192 0.000427246L56.2991 11.1804L67.8784 0.000427246L79.0584 11.1804L50.7092 39.5296L118.588 107.408L146.937 79.0588L158.117 90.2388L146.937 101.818L158.117 112.998L141.347 129.768L152.527 141.347L141.347 152.527L129.768 141.347L112.998 158.117L101.818 146.937L90.2383 158.117Z" fill="white" fillOpacity="0.1" />
                </svg>
            </div>
            <div className={styles.cardContent}>
                <div>
                    <div className={styles.cardHeader}>
                        <span className={styles.badge}>Nenhum pacote ativo</span>
                        <h3 className={styles.cardTitle}>Comece sua jornada hoje!</h3>
                        <p className={styles.cardDescription}>
                            Assine agora e tenha acesso imediato a uma estrutura completa para o seu treino.
                        </p>
                    </div>
                    <ul className={styles.featureList}>
                        <TextWithoutPlan text="Plano de treino personalizado" />
                        <TextWithoutPlan text="Agendamentos de consultoria presencial" />
                        <TextWithoutPlan text="Consultoria online via Whatsapp" />
                        <TextWithoutPlan text="Contato direto com o personal" />
                    </ul>
                </div>
                <SmallerButton
                    title="Ver pacotes disponíveis"
                    handleButtonClick={() => nav("/packages")}
                    icon={<ShoppingBag />}
                    iconPosition="right"
                    classname={styles.btnOverview}
                />
            </div>
        </section>
    )
}
