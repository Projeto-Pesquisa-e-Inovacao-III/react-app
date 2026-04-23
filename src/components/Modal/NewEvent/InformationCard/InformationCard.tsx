import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./InformationCard.module.css";

type Option = {
    value: string | number;
    label: string;
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

    const currentIndex = hasOptions
        ? options.findIndex((o) => String(o.value) === String(selectedValue))
        : -1;

    function handlePrev() {
        if (!hasOptions) return;
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        onOptionChange(options[prevIndex].value);
    }

    function handleNext() {
        if (!hasOptions) return;
        const nextIndex = (currentIndex + 1) % options.length;
        onOptionChange(options[nextIndex].value);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.labelRow}>
                <label className={styles.label}>{title}</label>
                {hasOptions && (
                    <span className={styles.counter}>
                        {currentIndex + 1}/{options.length}
                    </span>
                )}
            </div>

            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    {icon}
                </div>

                <div className={styles.textWrapper}>
                    <p className={styles.subtitle}>{subtitle}</p>
                    <p className={styles.subtitle2}>{subtitle2}</p>
                </div>

                {hasOptions && (
                    <div className={styles.navButtons}>
                        <button type="button" className={styles.navBtn} onClick={handlePrev}>
                            <ChevronLeft size={16} />
                        </button>
                        <button type="button" className={styles.navBtn} onClick={handleNext}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
