import classNames from "classnames";
import styles from "./Button.module.css"
import { Oval } from "react-loader-spinner";


type Props = {

    type: "submit" | "button";
    typeButton?: "accept" | "decline" | "other";
    title: string;
    icon?: React.ReactNode;
    classNameVariable?: string;
    classNameDiv?: string;
    onClick?: () => void;
    loading?: boolean;
}

export default function Button({ type, title, classNameVariable, classNameDiv, onClick, icon, typeButton, loading }: Props) {
    return (
        <div className={classNames(styles.btnGeneric, classNameDiv)}>
            <button
                className={classNames(styles[`${typeButton}`], classNameVariable)}
                type={type}
                onClick={onClick}
                
            >
                {icon && <span className={styles.icon}>{icon}</span>}
                {loading ?

                    <div className={styles.LoadingIcon}>
                        <Oval
                            height={25}
                            width={25}
                            color="#fff"
                            visible={true}
                            ariaLabel="oval-loading"
                            secondaryColor="#fff"
                            strokeWidth={3}
                            strokeWidthSecondary={3}

                        />
                    </div>
                    : title}
            </button>
        </div>
    )
}