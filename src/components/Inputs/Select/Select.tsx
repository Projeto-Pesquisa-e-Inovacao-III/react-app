import Skeleton from "react-loading-skeleton";
import styles from "./Select.module.css"

type Props = {
    placeholder: string;
    label?: string;
    id?: string;
    onInputChange: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
    icon?: React.ReactNode;
    value?: string;
    name?: string;
    valuesName?: string[];
    options?: string[];
    className?: string;

    isLoading?: boolean;
}

export default function Select({ placeholder, label, id, onInputChange, icon, value, name, options, valuesName, className, isLoading }: Props) {

    return (
        <>

            {isLoading ? (
                <Skeleton height={40} />
            ) : (
                <div className={`${styles.wrapperInp} ${className}`}>
                    {label && <label htmlFor={`${id}-select`}>{label}</label>}
                    {icon && <div className={styles.selectIcon}>{icon}</div>}
                    <select
                        id={`${id}-select`}
                        name={name}
                        value={value}
                        onChange={(e) => onInputChange(e.target.value)}
                        className={`input-with-icon ${!icon ? styles.dontHasIcon : ""}`}
                    >
                        <option value="" disabled>{placeholder}</option>
                        {options?.map((option, index) => (
                            <option key={index} value={option} >{valuesName ? valuesName[index] : option}</option>
                        ))}
                    </select>
                </div>
            )}
        </>
    )
}