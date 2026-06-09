import { Dumbbell } from "lucide-react";
import styles from "./PageLoader.module.css";

export default function PageLoader() {
    return (
        <div className={styles.container}>
            <Dumbbell className={styles.skeletonIcon} size={64} />
        </div>
    );
}
