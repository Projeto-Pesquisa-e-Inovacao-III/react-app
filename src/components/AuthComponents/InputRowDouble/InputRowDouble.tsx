import classNames from "classnames";
import styles from "./InputRowDouble.module.css"

type Props = {
    firstPlaceholder: string;
    secondPlaceholder: string;
    firstIcon: React.ReactNode;
    secondIcon: React.ReactNode;
    valueFirst?: string;
    valueSecond?: string;
    setFirstOnChange: React.Dispatch<React.SetStateAction<string>>;
    setSecondOnChange: React.Dispatch<React.SetStateAction<string>>;
}

export default function InputRowDouble({ firstPlaceholder, secondPlaceholder, firstIcon, secondIcon, setFirstOnChange, setSecondOnChange, valueFirst, valueSecond }: Props) {
    return (
        <div className={styles.doubleRowInput}>
            <div className={styles.firstBlock}>
                <div className={classNames(`${styles.wrapperInp}`, `wrapper_inp`)}>
                    <div className={styles.inputIcon}>{firstIcon}</div>
                    <input
                        type="text"
                        name="name"
                        placeholder={firstPlaceholder}
                        onChange={(e) => setFirstOnChange(e.target.value)}
                        value={valueFirst}
                    />
                </div>
            </div>
            <div className={styles.secondBlock}>
                <div className={classNames(`${styles.wrapperInp}`, `wrapper_inp`)}>
                    <div className={styles.inputIcon}>{secondIcon}</div>
                    <input
                        type="text"
                        name="costumerDocument"
                        placeholder={secondPlaceholder}
                        onChange={(e) => setSecondOnChange(e.target.value)}
                        value={valueSecond}
                    // onInput={(e) => cpfMask(e)}
                    />
                </div>
            </div>
        </div>
    )
}