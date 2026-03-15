import { useState } from "react";
import { X } from "lucide-react";
import styles from "./InputTags.module.css";

type InputTagsProps = {
    label: React.ReactNode;
    placeholder?: string;
    icon?: React.ReactNode;
    value?: string[];
    maxTags?: number;
    maxTagCharacters?: number;
    delimiter?: string;
    onTagsChange?: (tags: string[]) => void;
};

export default function InputTags({
    label,
    placeholder = "Digite e finalize com ;",
    icon,
    value,
    maxTags = 5,
    maxTagCharacters = 40,
    delimiter = ";",
    onTagsChange
}: InputTagsProps) {
    const [internalTags, setInternalTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const tags = value ?? internalTags;

    const updateTags = (updater: (previousTags: string[]) => string[]) => {
        const nextTags = updater(tags);

        if (value === undefined) {
            setInternalTags(nextTags);
        }

        onTagsChange?.(nextTags);
    };

    const handleInputChange = (value: string) => {
        const limitedValue = value.slice(0, maxTagCharacters);

        if (!limitedValue.includes(delimiter)) {
            setInputValue(limitedValue);
            return;
        }

        const parts = limitedValue.split(delimiter);
        const inputRemainder = parts.pop() ?? "";
        const parsedTags = parts
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
            .filter((item) => item.length <= maxTagCharacters);

        if (parsedTags.length > 0) {
            updateTags((previousTags) => {
                const existingTags = new Set(previousTags);
                const availableSlots = maxTags - previousTags.length;

                if (availableSlots <= 0) {
                    return previousTags;
                }

                const newTags = parsedTags
                    .filter((tag) => !existingTags.has(tag))
                    .slice(0, availableSlots);

                return [...previousTags, ...newTags];
            });
        }

        setInputValue(inputRemainder.trimStart().slice(0, maxTagCharacters));
    };

    const handleRemoveTag = (tagToRemove: string) => {
        updateTags((previousTags) => previousTags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className={styles.wrapper}>
            <p className={styles.label}>{label}</p>
            <div className={styles.inputWrapper}>
                {icon ? <span className={styles.inputIcon}>{icon}</span> : null}
                <div className={styles.content}>
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            className={styles.tagItem}
                            onClick={() => handleRemoveTag(tag)}
                        >
                            <span>{tag}</span>
                            <X size={14} />
                        </button>
                    ))}
                    <input
                        type="text"
                        className={styles.inputText}
                        placeholder={placeholder}
                        value={inputValue}
                        maxLength={maxTagCharacters}
                        onChange={(event) => handleInputChange(event.target.value)}
                        disabled={tags.length >= maxTags}
                    />
                </div>
            </div>
        </div>
    );
}
