import "./style.css"

type Props = {
    placeholder: string;
    label?: string;
    id?: string;
    onInputChange: React.Dispatch<React.SetStateAction<string>>;
    icon: React.ReactNode;
    value?: string;
    options?: string[];
}

export default function Select({ placeholder, label, id, onInputChange, icon, value, options }: Props) {

    return (
        <div className="wrapper_inp">
            <label htmlFor={`${id}-select`}>{label}</label>
            <div className="select-icon">{icon}</div>
            <select
                id={`${id}-select`}
                value={value}
                onChange={(e) => onInputChange(e.target.value)}
                className="input-with-icon"
            >
                <option value="" disabled>{placeholder}</option>
                {options?.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    )
}