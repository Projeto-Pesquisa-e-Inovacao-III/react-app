import "./style.css"

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
        <div className="double-row-input">
            <div className="first-block">
                <div className="wrapper_inp">
                    <div className="input-icon">{firstIcon}</div>
                    <input
                        type="text"
                        name="name"
                        placeholder={firstPlaceholder}
                        onChange={(e) => setFirstOnChange(e.target.value)}
                        value={valueFirst}
                    />
                </div>
            </div>
            <div className="second-block">
                <div className="wrapper_inp">
                    <div className="input-icon">{secondIcon}</div>
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
        
    );
}