import styles from "./PagBankModal.module.css";
import { Loader2 } from "lucide-react";
import classnames from "classnames";

export default function PagBankModal({ isMobile }: { isMobile: boolean }) {
    return (
        <>
            <div className={classnames("overlay", styles.backdropEnter)}></div>
            <div className={classnames(
                styles.modalCard,
                {
                    [styles.modalContainer]: !isMobile,
                    [styles.modalContainerMobile]: isMobile,
                }
            )}>
                <h2 className={styles.title}>Aguarde...</h2>
                
                <div className={styles.spinnerContainer}>
                    <Loader2 className={styles.spinner} size={48} color="var(--indigo, #1d4ed8)" />
                </div>
                
                <p className={styles.contentModal}>
                    Você será redirecionado para o ambiente seguro do PagBank em instantes.
                </p>
                
                <div className={styles.logoContainer}>
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/9/95/Logo_PagBank.png" 
                        alt="PagBank" 
                        className={styles.logo} 
                    />
                </div>
            </div>
        </>
    );
}
