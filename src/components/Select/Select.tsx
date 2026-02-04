import { ChevronDown, Search, Square, SquareCheck } from 'lucide-react';
import { useState } from 'react'
import InputWithIcon from '../Inputs/InputWithIcon/InputWithIcon';

type Props = {
    onSelectStatusChange?: (status: string) => void;
    selectStatusValue?: string;
    values?: Array<{ label: string; value: string }>;
    selectPlaceholder?: string;
}

export default function Select({ onSelectStatusChange, selectStatusValue, values, selectPlaceholder }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [textSearch, setTextSearch] = useState<string>("");

    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

    const [selectValue, setSelectValue] = useState<string>("");
    return (
        <div className='h-full'>
            <div className='h-full'>
                <span className='border border-[#ccc] cursor-pointer rounded-sm h-full flex items-center px-4' onClick={() => setIsOpen(!isOpen)} >
                    {selectPlaceholder || (selectStatusValue === "" ? "Selecionar todos" : selectValue) || "Selecionar status"}
                    <ChevronDown className={`inline-block ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} size={16} />
                </span>
            </div>
            {isOpen && (
                <>
                    <div className='absolute mt-1 bg-white rounded-lg' >
                        <InputWithIcon
                            icon={<Search size={16} />}
                            placeholder='O que você procura?'
                            value={textSearch}
                            onInputChange={setTextSearch}
                            type='text'
                        />
                        <div className='bg-white border-[#ccc] border p-2 flex flex-col gap-2 max-h-60 overflow-y-auto'>
                            <span className='px-1 gap-2 flex items-center cursor-pointer'
                                onMouseEnter={() => setHoveredOption("")}
                                onMouseLeave={() => setHoveredOption(null)}
                                onClick={() => onSelectStatusChange && onSelectStatusChange("")}>
                                {selectStatusValue !== "" &&
                                    (hoveredOption === "" ?
                                        <SquareCheck color='#093A5D' />
                                        :
                                        <Square className='border-indigo' color='#093A5D' />
                                    )
                                }
                                {selectStatusValue === "" && <SquareCheck color='#093A5D' />}
     
                                {selectPlaceholder || "Selecionar todos"}
                            </span>
                            {values && values.map((option) => (
                                (textSearch === "" || option.label.toLowerCase().includes(textSearch.toLowerCase())) && (
                                <span className='px-1 gap-2 flex items-center cursor-pointer'
                                    key={option.value}
                                    onMouseEnter={() => setHoveredOption(option.value)}
                                    onMouseLeave={() => setHoveredOption(null)}
                                    onClick={() => {
                                        setSelectValue(option.label);
                                        if (onSelectStatusChange) {
                                            onSelectStatusChange(option.value);
                                        }
                                    }}>
                                    {selectStatusValue !== option.value &&
                                        (hoveredOption === option.value ?
                                            <SquareCheck color='#093A5D' />
                                            :
                                            <Square className='border-indigo' color='#093A5D' />
                                        )
                                    }
                                    {selectStatusValue === option.value && <SquareCheck color='#093A5D' />}
                                    {option.label}
                                </span>
                                )
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
