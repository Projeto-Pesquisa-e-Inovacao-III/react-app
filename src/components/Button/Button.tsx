import styles from "./Button.module.css"

type Props = {
    type: "submit" | "button";
    title: string;
    icon?: React.ReactNode;
    classNameVariable?: string;
    onClick?: () => void;
}

export default function Button({ type, title, classNameVariable, onClick, icon }: Props) {
    return (
        <div className={styles.btnGeneric}>
            <button
                className={`${styles[type] || ''} ${classNameVariable ? styles[classNameVariable] : ''}`}
                type={type}
                onClick={onClick}
            >
                {icon && <span className={styles.icon}>{icon}</span>}
                {title}
            </button>
        </div>
    )
}