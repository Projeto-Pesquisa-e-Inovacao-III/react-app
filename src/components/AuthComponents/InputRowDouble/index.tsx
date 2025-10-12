import "./style.css"

type Props = {
    firstPlaceholder: string;
    secondPlaceholder: string;
    firstIcon: React.ReactNode;
    secondIcon: React.ReactNode;
    setFirstOnChange: React.Dispatch<React.SetStateAction<string>>;
    setSecondOnChange: React.Dispatch<React.SetStateAction<string>>;
}

export default function InputRowDouble({ firstPlaceholder, secondPlaceholder, firstIcon, secondIcon, setFirstOnChange, setSecondOnChange }: Props) {
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
                    // onInput={(e) => cpfMask(e)}
                    />
                </div>
            </div>
        </div>
        
    );
}