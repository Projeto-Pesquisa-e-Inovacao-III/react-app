import { ChevronDown, Search, Square, SquareCheck } from 'lucide-react';
import {useState } from 'react'
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

    return (
        <div className='h-full'>
            <div className='h-full'>
                <span className='border border-[#ccc] cursor-pointer rounded-sm h-full flex items-center px-4' onClick={() => setIsOpen(!isOpen)} >
                    {selectPlaceholder || selectStatusValue}
                    <ChevronDown className={`inline-block ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} size={16} />
                </span>
            </div>
            {isOpen && (
                <>
                    <div className='absolute mt-3 bg-white rounded-lg' >
                        <InputWithIcon
                            icon={<Search size={16} />}
                            placeholder='O que você procura?'
                            value={textSearch}
                            onInputChange={(e) => setTextSearch(e.target.value)}
                            type='text'
                        />
                        <div className='bg-white border-[#ccc] border p-2 flex flex-col gap-2 max-h-60 overflow-y-auto'>
                            <span className='px-1 gap-2 flex items-center'
                                onMouseEnter={() => setHoveredOption("")}
                                onMouseLeave={() => setHoveredOption(null)}
                                onClick={() => onSelectStatusChange && onSelectStatusChange("")}>
                                {hoveredOption ?
                                    <SquareCheck color='#093A5D' />
                                    :
                                    <Square className='border-indigo' color='#093A5D' />
                                }
                                {selectPlaceholder || "Selecionar todos"}
                            </span>
                            {values && values.map((option) => (
                                <span className='px-1 gap-2 flex items-center'
                                    key={option.value}
                                    onMouseEnter={() => setHoveredOption(option.value)}
                                    onMouseLeave={() => setHoveredOption(null)}
                                    onClick={() => onSelectStatusChange && onSelectStatusChange(option.value)}>
                                    {hoveredOption === option.value ?
                                        <SquareCheck color='#093A5D' />

                                        :
                                        <Square className='border-indigo' color='#093A5D' />

                                    }
                                    {option.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
