import "./style.css"

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
}

export default function InputRowTriple({ firstPlaceholder, secondPlaceholder, thirdPlaceholder, firstIcon, secondIcon, thirdIcon, thirdIsSelect, setFirstOnChange, setSecondOnChange, setThirdOnChange }: Props) {
    return (
        <div className="triple-row-input">
            <div className="input-block">
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
            <div className="input-block">
                <div className="wrapper_inp">
                    <div className="input-icon">{secondIcon}</div>
                    <input
                        type="text"
                        placeholder={secondPlaceholder}
                        onChange={(e) => setSecondOnChange(e.target.value)}
                    />
                </div>
            </div>


            {thirdIsSelect ? (
                <div className="input-block">
                    <div className="wrapper_inp">
                        <div className="input-icon">{thirdIcon}</div>
                        <select onChange={(e) => setThirdOnChange(e.target.value)}>
                            <option value="#" disabled selected>{thirdPlaceholder}</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </div>
                </div>
            ) : (
                <div className="input-block">
                    <div className="wrapper_inp">
                        <div className="input-icon">{thirdIcon}</div>
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