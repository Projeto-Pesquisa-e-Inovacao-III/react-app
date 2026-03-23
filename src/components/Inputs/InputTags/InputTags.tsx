import { useState } from "react";
import { Plus, X } from "lucide-react";
import styles from "./InputTags.module.css";

type InputTagsProps = {
    label: React.ReactNode;
    placeholder?: string;
    icon?: React.ReactNode;
    value?: string[];
    maxTags?: number;
    maxTagCharacters?: number;
    onTagsChange?: (tags: string[]) => void;
};

export default function InputTags({
    label,
    placeholder = "Digite e pressione Enter ou +",
    icon,
    value,
    maxTags = 5,
    maxTagCharacters = 40,
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
        setInputValue(value.slice(0, maxTagCharacters));
    };

    const handleAddTag = () => {
        const normalizedTag = inputValue.trim();

        if (normalizedTag.length === 0 || normalizedTag.length > maxTagCharacters) {
            return;
        }

        updateTags((previousTags) => {
            if (previousTags.length >= maxTags) {
                return previousTags;
            }

            if (previousTags.includes(normalizedTag)) {
                return previousTags;
            }

            return [...previousTags, normalizedTag];
        });

        setInputValue("");
    };

    const handleRemoveTag = (tagToRemove: string) => {
        updateTags((previousTags) => previousTags.filter((tag) => tag !== tagToRemove));
    };

    const handleRemoveLastTag = () => {
        updateTags((previousTags) => previousTags.slice(0, -1));
    };

    return (
        <div className={styles.wrapper}>
            <p className={styles.label}>{label}</p>
            <div className={`${styles.inputWrapper} ${icon ? styles.inputWrapperWithIcon : ""}`}>
                {icon ? <span className={styles.inputIcon}>{icon}</span> : null}
                <div className={styles.content}>
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            className={styles.tagItem}
                            onClick={() => handleRemoveTag(tag)}
                        >
                            <span className={styles.tagText}>{tag}</span>
                            <span className={styles.removeIcon}>
                                <X size={10} />
                            </span>
                        </button>
                    ))}
                    <input
                        type="text"
                        className={styles.inputText}
                        placeholder={placeholder}
                        value={inputValue}
                        maxLength={maxTagCharacters}
                        onChange={(event) => handleInputChange(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                handleAddTag();
                                return;
                            }

                            if (event.key === "Backspace" && inputValue.trim().length === 0 && tags.length > 0) {
                                event.preventDefault();
                                handleRemoveLastTag();
                            }
                        }}
                        disabled={tags.length >= maxTags}
                    />
                </div>
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={handleAddTag}
                    disabled={tags.length >= maxTags || inputValue.trim().length === 0}
                    aria-label="Adicionar tag"
                >
                    <Plus size={10} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
