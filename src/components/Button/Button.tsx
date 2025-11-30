import classNames from "classnames";
import styles from "./Button.module.css"

type Props = {

    type: "submit" | "button";
    typeButton?: "accept" | "decline" | "other";
    title: string;
    icon?: React.ReactNode;
    classNameVariable?: string;
    classNameDiv?: string;
    onClick?: () => void;
}

export default function Button({ type, title, classNameVariable, classNameDiv, onClick, icon, typeButton }: Props) {
    return (
        <div className={classNames(styles.btnGeneric, classNameDiv)}>
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