import { ChevronDown, Search, Square, SquareCheck } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import InputWithIcon from '../Inputs/InputWithIcon/InputWithIcon';
import styles from './Select.module.css';
import useClickOutside from '../../hooks/useClickOutside';

type Props = {
  id: string;
  openSelectId: string | null;
  setOpenSelectId: (id: string | null) => void;
  onSelectStatusChange: React.Dispatch<React.SetStateAction<string>>;
  selectStatusValue?: string;
  values?: Array<{ label: string; value: string }>;
  selectPlaceholder?: string;

  showSelectAll?: boolean;
  showSearchInput?: boolean;
  defaultValue?: string;
  fixedText?: string;
}

export default function Select({ id, openSelectId, setOpenSelectId, onSelectStatusChange, selectStatusValue, values, selectPlaceholder, defaultValue, fixedText, showSelectAll = true, showSearchInput = true }: Props) {
  const isOpen = openSelectId === id;

  const [textSearch, setTextSearch] = useState<string>("");

  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const [selectValue, setSelectValue] = useState<string>("");

  useEffect(() => {
    if (defaultValue && onSelectStatusChange) {
      onSelectStatusChange(defaultValue);
      setSelectValue(defaultValue);
    }
  }, [defaultValue, onSelectStatusChange]);

  const selectRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: selectRef,
    callback: () => {
      if (isOpen) {
        setOpenSelectId(null);
      }
    }
  });

  return (
    <div ref={selectRef} className={styles.selectWrapper} style={isOpen ? { border: "1px solid #c3c3c3" } : {}} >
      <div className={styles.triggerWrapper}>
        <span
          className={styles.trigger}
          onClick={() => setOpenSelectId(isOpen ? null : id)}
        >
          {fixedText ? fixedText : ""} {(selectStatusValue === "" ? selectPlaceholder : selectValue)}
          <ChevronDown
            className={`${styles.chevronIcon} ${isOpen ? styles.rotate180 : ""}`}
            size={16}
          />
        </span>
      </div>
      {isOpen && (
        <div className={styles.dropdownContainer}>
          {showSearchInput !== false && (
            <InputWithIcon
              icon={<Search size={16} />}
              placeholder='O que você procura?'
              value={textSearch}
              onInputChange={setTextSearch}
              type='text'
              customClassName={"p-3"}
            />
          )}
          <div className={styles.optionsList}>
            {showSelectAll !== false && (
              <span
                className={styles.optionItem}
                onMouseEnter={() => setHoveredOption("")}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => onSelectStatusChange && onSelectStatusChange("")}
              >
                {selectStatusValue !== "" &&
                  (hoveredOption === "" ?
                    <SquareCheck color='#093A5D' />
                    :
                    <Square className={styles.iconBorderIndigo} color='#093A5D' />
                  )
                }
                {selectStatusValue === "" && <SquareCheck color='#093A5D' />}

                Selecionar todos
              </span>
            )}
            {values && values.map((option) => (
              (textSearch === "" || option.label.toLowerCase().includes(textSearch.toLowerCase())) && (
                <span
                  className={styles.optionItem}
                  key={option.value}
                  onMouseEnter={() => setHoveredOption(option.value)}
                  onMouseLeave={() => setHoveredOption(null)}
                  onClick={() => {
                    setSelectValue(option.label);
                    if (onSelectStatusChange) {
                      onSelectStatusChange(option.value);
                    }
                  }}
                >
                  {selectStatusValue !== option.value &&
                    (hoveredOption === option.value ?
                      <SquareCheck color='#093A5D' />
                      :
                      <Square className={styles.iconBorderIndigo} color='#093A5D' />
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
