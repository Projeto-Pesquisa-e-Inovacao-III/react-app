import "./style.css"

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
}

export default function Select({ placeholder, label, id, onInputChange, icon, value, name, options, valuesName, className }: Props) {

    return (
        <div className={`wrapper_inp ${className}`}>
            <label htmlFor={`${id}-select`}>{label}</label>
            {icon && <div className="select-icon">{icon}</div>}
            <select
                id={`${id}-select`}
                name={name}
                value={value}
                onChange={(e) => onInputChange(e.target.value)}
                className={`input-with-icon ${!icon ? "dont-has-icon" : ""}`}
            >
                <option value="" disabled>{placeholder}</option>
                {options?.map((option, index) => (
                    <option key={index} value={option} >{valuesName ? valuesName[index] : option}</option>
                ))}
            </select>
        </div>
    )
}