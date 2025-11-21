import classNames from "classnames";
import styles from "./Button.module.css"

type Props = {
    type: "submit" | "button";
    typeButton?: "accept" | "decline" | "other";
    title: string;
    icon?: React.ReactNode;
    classNameVariable?: string;
    onClick?: () => void;
}

export default function Button({ type, title, classNameVariable, onClick, icon, typeButton }: Props) {
    return (
        <div className={styles.btnGeneric}>
            <button
                className={classNames(styles[typeButton], classNameVariable)}
                type={type}
                onClick={onClick}
            >
                {icon && <span className={styles.icon}>{icon}</span>}
                {title}
            </button>
        </div>
    )
}