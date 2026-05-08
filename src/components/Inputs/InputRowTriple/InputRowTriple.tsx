import styles from "./InputRowTriple.module.css"

type Props = {
    firstPlaceholder: string;
    secondPlaceholder: string;
    thirdPlaceholder: string;
    firstIcon: React.ReactNode;
    secondIcon: React.ReactNode;
    thirdIcon: React.ReactNode;
    thirdIsSelect: boolean;
    setFirstOnChange: React.Dispatch<React.SetStateAction<string>>;
    setSecondOnChange: React.Dispatch<React.SetStateAction<string>>;
    setThirdOnChange: React.Dispatch<React.SetStateAction<string>>;
    valueFirst?: string;
    valueSecond?: string;
    valueThird?: string;
    validatorFirst?: (event: React.FormEvent<HTMLInputElement>) => void;
    validatorSecond?: (event: React.FormEvent<HTMLInputElement>) => void;
}

export default function InputRowTriple({ firstPlaceholder, secondPlaceholder, thirdPlaceholder, firstIcon, secondIcon, thirdIcon, thirdIsSelect, setFirstOnChange, setSecondOnChange, setThirdOnChange, valueFirst, valueSecond, valueThird, validatorFirst, validatorSecond }: Props) {
    return (
        <div className={styles.tripleRowInput}>
            <div className={styles.inputBlock}>
                <div className={styles.wrapperInp}>
                    <div className={styles.inputIcon}>{firstIcon}</div>
                    <input
                        type="text"
                        name="name"
                        placeholder={firstPlaceholder}
                        onChange={(e) => setFirstOnChange(e.target.value)}
                        value={valueFirst}
                        onInput={validatorFirst}
                    />
                </div>
            </div>
            <div className={styles.inputBlock}>
                <div className={styles.wrapperInp}>
                    <div className={styles.inputIcon}>{secondIcon}</div>
                    <input
                        type="text"
                        placeholder={secondPlaceholder}
                        onChange={(e) => setSecondOnChange(e.target.value)}
                        value={valueSecond}
                        onInput={validatorSecond}
                    />
                </div>
            </div>


            {thirdIsSelect ? (
                <div className={styles.inputBlock}>
                    <div className={styles.wrapperInp}>
                        <div className={styles.inputIcon}>{thirdIcon}</div>
                        <select defaultValue={valueThird} onChange={(e) => setThirdOnChange(e.target.value)}>
                            <option value="#" disabled selected>{thirdPlaceholder}</option>
                            <option value="male">Masculino</option>
                            <option value="female">Feminino</option>
                            <option value="other">Outro</option>
                        </select>
                    </div>
                </div>
            ) : (
                <div className={styles.inputBlock}>
                    <div className={styles.wrapperInp}>
                        <div className={styles.inputIcon}>{thirdIcon}</div>
                        <input
                            type="text"
                            placeholder={thirdPlaceholder}
                            onChange={(e) => setThirdOnChange(e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}