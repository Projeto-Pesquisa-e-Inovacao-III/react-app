import CardDropdown from "./CardDropdown/CardDropdown";
import styles from "./InformationCard.module.css";

type Option = {
    value: string | number;
    label: string;
    image?: string;
    subtitle?: string;
};

type Props = {
    icon: React.ReactNode | React.ReactElement;
    title: string;
    subtitle: string | undefined;
    subtitle2?: string;
    options?: Option[];
    selectedValue?: string | number;
    onOptionChange?: (value: string | number) => void;
}


export default function InformationCard({ icon, title, subtitle, subtitle2, options, selectedValue, onOptionChange }: Props) {
    const hasOptions = options && options.length > 1 && onOptionChange;

    return (
        <div className={styles.wrapper}>
            <div className={styles.labelRow}>
                <label className={styles.label}>{title}</label>
            </div>

            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    {icon}
                </div>

                <div className={styles.textWrapper}>
                    <p className={styles.subtitle}>{subtitle}</p>
                    <p className={styles.subtitle2}>{subtitle2}</p>
                </div>

                {hasOptions && onOptionChange && (
                    <CardDropdown 
                        options={options} 
                        selectedValue={selectedValue} 
                        onOptionChange={onOptionChange} 
                    />
                )}
            </div>
        </div>
    )
}
