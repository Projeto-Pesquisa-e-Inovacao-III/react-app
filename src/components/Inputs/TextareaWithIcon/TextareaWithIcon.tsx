import styles from "./TextareaWithIcon.module.css";

type TextareaWithIconProps = {
    placeholder?: string;
    icon?: React.ReactNode;
    label?: React.ReactNode;
    id?: string;
    onInputChange?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
    value?: string | null;
    maxLength?: number;
    disabled?: boolean;
    customClassName?: string;
    classNameTextarea?: string;
    name?: string;
    rows?: number;
};

export default function TextareaWithIcon({
    placeholder,
    label,
    id,
    onInputChange,
    icon,
    value,
    maxLength,
    disabled,
    customClassName,
    classNameTextarea,
    name,
    rows = 4
}: TextareaWithIconProps) {
    const currentLength = (value ?? "").length;

    return (
        <div className={`${styles.wrapperTextarea} ${customClassName || ""}`} id={id}>
            {label && <label htmlFor={`${id}-textarea`}>{label}</label>}

            <div className="relative">
                {icon && <div className={styles.inputIcon}>{icon}</div>}

                <textarea
                    id={`${id}-textarea`}
                    name={name}
                    className={`${icon ? styles.withIcon : ""} ${classNameTextarea || ""}`}
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={(event) => onInputChange?.(event.target.value)}
                    maxLength={maxLength}
                    disabled={disabled}
                    rows={rows}
                />
            </div>

            {maxLength != null && <span className={styles.counter}>{currentLength}/{maxLength}</span>}
        </div>
    );
}