import { ChevronDown, Search, Square, SquareCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'
import InputWithIcon from '../Inputs/InputWithIcon/InputWithIcon';

type Props = {
    id: string;
    openSelectId: string | null;
    setOpenSelectId: (id: string | null) => void;

    onSelectStatusChange?: (status: string) => void;
    selectStatusValue?: string;
    values?: Array<{ label: string; value: string }>;
    selectPlaceholder?: string;
}

export default function Select({ id, openSelectId, setOpenSelectId, onSelectStatusChange, selectStatusValue, values, selectPlaceholder }: Props) {
    const isOpen = openSelectId === id;

    const [textSearch, setTextSearch] = useState<string>("");

    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

    const [selectValue, setSelectValue] = useState<string>("");

    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target as Node)
            ) {
                setOpenSelectId(null);
            }
        }

        if (isOpen) {
            // Pequeno delay para evitar que o clique que abriu o select feche ele
            setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setOpenSelectId]);

    return (
        <div ref={selectRef} className='relative h-full'>
            <div className='h-full'>
                <span className='border border-[#ccc] cursor-pointer rounded-sm h-full flex items-center px-4' onClick={() => setOpenSelectId(isOpen ? null : id)} >
                    {selectStatusValue === "" ? "Selecionar todos" : selectValue}

                    <ChevronDown className={`inline-block ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} size={16} />
                </span>
            </div>
            {isOpen && (
                <div className='absolute mt-1 bg-white rounded-lg z-50' >
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

                            Selecionar todos
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
            )}
        </div>
    )
}
