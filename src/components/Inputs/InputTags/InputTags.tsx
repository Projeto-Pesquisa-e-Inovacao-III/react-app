import { useState, useRef, useCallback } from "react";
import { Pencil, Plus, X } from "lucide-react";
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
    placeholder = "Digite e pressione Enter",
    icon,
    value,
    maxTags = 5,
    maxTagCharacters = 40,
    onTagsChange
}: InputTagsProps) {
    const [internalTags, setInternalTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);
    const [shakingTag, setShakingTag] = useState<string | null>(null);
    const [removingTags, setRemovingTags] = useState<Set<string>>(new Set());
    const [editingTag, setEditingTag] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const tags = value ?? internalTags;
    const isAtLimit = tags.length >= maxTags;
    const hasInput = inputValue.trim().length > 0;

    const updateTags = (updater: (previousTags: string[]) => string[]) => {
        const nextTags = updater(tags);
        if (value === undefined) setInternalTags(nextTags);
        onTagsChange?.(nextTags);
    };

    const handleInputChange = (val: string) => {
        setInputValue(val.slice(0, maxTagCharacters));
    };

    const handleAddTag = useCallback(() => {
        const normalizedTag = inputValue.trim();
        if (normalizedTag.length === 0) return;

        // Se é a mesma string que estava sendo editada, é OK (edição no lugar)
        const isDuplicate = tags.includes(normalizedTag) && normalizedTag !== editingTag;

        if (isDuplicate) {
            setShakingTag(normalizedTag);
            setTimeout(() => setShakingTag(null), 500);
            return;
        }

        updateTags((previousTags) => {
            if (previousTags.length >= maxTags) return previousTags;
            // Se editando, a tag original já foi removida — só adiciona a nova
            return [...previousTags, normalizedTag];
        });

        setInputValue("");
        setEditingTag(null);
    }, [inputValue, tags, maxTags, editingTag]);

    const handleRemoveTag = (tagToRemove: string) => {
        // Se estava editando essa tag e agora deletou, cancela edição
        if (editingTag === tagToRemove) {
            setEditingTag(null);
            setInputValue("");
        }
        setRemovingTags((prev) => new Set(prev).add(tagToRemove));
        setTimeout(() => {
            updateTags((previousTags) => previousTags.filter((tag) => tag !== tagToRemove));
            setRemovingTags((prev) => {
                const next = new Set(prev);
                next.delete(tagToRemove);
                return next;
            });
        }, 200);
    };

    const handleEditTag = (tag: string) => {
        // Remove a tag da lista e coloca no input para edição
        updateTags((previousTags) => previousTags.filter((t) => t !== tag));
        setInputValue(tag);
        setEditingTag(tag);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleCancelEdit = () => {
        // Devolve a tag original e limpa o input
        if (editingTag) {
            updateTags((previousTags) => [...previousTags, editingTag]);
        }
        setInputValue("");
        setEditingTag(null);
    };

    const handleRemoveLastTag = () => {
        if (tags.length === 0) return;
        const last = tags[tags.length - 1];
        handleEditTag(last);
    };

    const focusInput = () => inputRef.current?.focus();

    return (
        <div className={styles.wrapper}>
            <div className={styles.labelRow}>
                <p className={styles.label}>{label}</p>
                <span className={`${styles.counter} ${isAtLimit ? styles.counterAtLimit : ""}`}>
                    {tags.length}/{maxTags}
                </span>
            </div>

            <div
                className={[
                    styles.inputWrapper,
                    icon ? styles.inputWrapperWithIcon : "",
                    isFocused ? styles.inputWrapperFocused : "",
                    isAtLimit ? styles.inputWrapperAtLimit : "",
                    editingTag ? styles.inputWrapperEditing : "",
                ].filter(Boolean).join(" ")}
                onClick={focusInput}
            >
                {icon ? <span className={styles.inputIcon}>{icon}</span> : null}

                <div className={styles.content}>
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className={[
                                styles.tagItem,
                                shakingTag === tag ? styles.tagShake : "",
                                removingTags.has(tag) ? styles.tagRemoving : "",
                            ].filter(Boolean).join(" ")}
                            title={`Clique para editar "${tag}"`}
                        >
                            
                            <button
                                type="button"
                                className={styles.tagBody}
                                onClick={(e) => { e.stopPropagation(); handleEditTag(tag); }}
                            >
                                <span className={styles.tagText}>{tag}</span>
                                <span className={styles.editHint}>
                                    <Pencil size={9} />
                                </span>
                            </button>

                            
                            <span className={styles.tagDivider} />

                            
                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={(e) => { e.stopPropagation(); handleRemoveTag(tag); }}
                                aria-label={`Remover "${tag}"`}
                            >
                                <X size={9} />
                            </button>
                        </span>
                    ))}

                    {!isAtLimit ? (
                        <div className={styles.inputArea}>
                            {editingTag && (
                                <span className={styles.editingBadge}>
                                    <Pencil size={10} /> editando
                                </span>
                            )}
                            <input
                                ref={inputRef}
                                type="text"
                                className={styles.inputText}
                                placeholder={tags.length === 0 && !editingTag ? placeholder : ""}
                                value={inputValue}
                                maxLength={maxTagCharacters}
                                onChange={(event) => handleInputChange(event.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        handleAddTag();
                                        return;
                                    }
                                    if (event.key === "Escape" && editingTag) {
                                        event.preventDefault();
                                        handleCancelEdit();
                                        return;
                                    }
                                    if (event.key === "Backspace" && inputValue.trim().length === 0 && tags.length > 0 && !editingTag) {
                                        event.preventDefault();
                                        handleRemoveLastTag();
                                    }
                                }}
                            />
                            {hasInput && (
                                <span className={styles.enterHint}>
                                    ↵ Enter
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className={styles.limitMessage}>Limite atingido</span>
                    )}
                </div>

                
                {!isAtLimit && !hasInput && (
                    <button
                        type="button"
                        className={styles.addButton}
                        disabled
                        aria-label="Adicionar tag"
                    >
                        <Plus size={12} strokeWidth={2.5} />
                    </button>
                )}
            </div>

            
            {(hasInput || editingTag) && (
                <div className={styles.actions}>
                    <div className={styles.actionsLeft}>
                        {inputValue.length > 0 && (
                            <span className={`${styles.charCounter} ${inputValue.length >= maxTagCharacters ? styles.charCounterAtLimit : ""}`}>
                                {inputValue.length}/{maxTagCharacters}
                            </span>
                        )}

                    </div>

                    <div className={styles.actionsRight}>
                        {editingTag && (
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                            >
                                Cancelar
                            </button>
                        )}
                        {!isAtLimit && hasInput && (
                            <button
                                type="button"
                                className={styles.addButtonActive}
                                onClick={(e) => { e.stopPropagation(); handleAddTag(); }}
                                aria-label={editingTag ? "Salvar edição" : "Adicionar tag"}
                            >
                                <Plus size={11} strokeWidth={2.5} />
                                <span>{editingTag ? "Salvar" : "Adicionar"}</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            
            {!hasInput && !editingTag && (
                <div className={styles.footer}>
                    {tags.length > 0 ? (
                        <span className={styles.editTip}>Clique numa tag para editar</span>
                    ) : null}
                </div>
            )}
        </div>
    );
}
