import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./CardDropdown.module.css";
import useClickOutside from "../../../../../hooks/useClickOutside";
import UserAvatar from "../../../../UserAvatar/UserAvatar";
import classnames from "classnames";

type Option = {
    value: string | number;
    label: string;
    image?: string;
    subtitle?: string;
};

type Props = {
    options: Option[];
    selectedValue?: string | number;
    onOptionChange: (value: string | number) => void;
};

export default function CardDropdown({ options, selectedValue, onOptionChange }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function closeDropdown() {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 180);
    }

    useClickOutside({
        ref: dropdownRef,
        callback: () => {
            if (isOpen && !isClosing) {
                closeDropdown();
            }
        }
    });

    function handleToggle() {
        if (isOpen && !isClosing) {
            closeDropdown();
        } else if (!isOpen) {
            setIsOpen(true);
        }
    }

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button type="button" className={styles.triggerBtn} onClick={handleToggle}>
                <ChevronDown size={16} />
            </button>

            {isOpen && (
                <>
                    <div className={classnames(styles.overlayMobile, { [styles.closingOverlay]: isClosing })} onClick={closeDropdown} />
                    <div className={classnames(styles.dropdownMenu, { [styles.closing]: isClosing })}>
                    {options.map((option) => (
                        <div 
                            key={option.value} 
                            className={`${styles.optionItem} ${selectedValue === option.value ? styles.selected : ''}`}
                            onClick={() => {
                                onOptionChange(option.value);
                                closeDropdown();
                            }}
                        >
                            <div className={styles.avatarWrapper}>
                                <UserAvatar useUserImage={true} foto={option.image} userName={option.label} />
                            </div>
                            <div className={styles.optionText}>
                                <span className={styles.optionName}>{option.label}</span>
                                {option.subtitle && <span className={styles.optionSubtitle}>{option.subtitle}</span>}
                            </div>
                        </div>
                    ))}
                </div>
                </>
            )}
        </div>
    );
}
