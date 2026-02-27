import { ChevronDown, Search, Square, SquareCheck } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import InputWithIcon from '../Inputs/InputWithIcon/InputWithIcon';
import styles from './Select.module.css';
import useClickOutside from '../../hooks/useClickOutside';

type Props = {
  id: string;
  openSelectId: string | null;
  setOpenSelectId: (id: string | null) => void;
  onSelectStatusChange: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
  selectStatusValue?: string;
  values?: Array<{ icon?: React.ReactNode; label: string; value: string }>;

  selectPlaceholder?: string;
  iconPlaceholder?: React.ReactNode;

  showSelectAll?: boolean;
  showSearchInput?: boolean;
  defaultValue?: string;
  fixedText?: string;
  label?: string;

  labelClassName?: string;
  dropDownClassName?: string
  triggerClassName?: string;
  triggerWrapperClassName?: string;
  selectWrapperClassName?: string;
  containerClassName?: string;

  clear?: boolean;
}

export default function Select({ id, openSelectId, setOpenSelectId, onSelectStatusChange, selectStatusValue, values, selectPlaceholder, defaultValue, fixedText, showSelectAll = true, showSearchInput = true, dropDownClassName, label, labelClassName, triggerClassName, triggerWrapperClassName, selectWrapperClassName, containerClassName, iconPlaceholder, clear }: Props) {
  const isOpen = openSelectId === id;
  const [textSearch, setTextSearch] = useState<{ icon?: React.ReactNode; text: string }>({ icon: undefined, text: "" });

  const [hoveredOption, setHoveredOption] = useState<string | null>(null);


  const [selectValue, setSelectValue] = useState<{ icon: React.ReactNode, text: string }>({ icon: undefined, text: "" });
  useEffect(() => {
    if (defaultValue && onSelectStatusChange) {
      onSelectStatusChange(defaultValue);
      const defaultOption = values?.find(option => option.value === defaultValue);
      setSelectValue({ icon: defaultOption?.icon, text: defaultOption?.label || "" });
    }
  }, [defaultValue]);

  const selectRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: selectRef,
    callback: () => {
      if (isOpen) {
        setOpenSelectId(null);
      }
    }
  });

  console.log(selectValue.text)

  useEffect(() => {
    if(clear && clear === true) {
      setSelectValue({ icon: undefined, text: "" });
    }
  }, [clear])

  return (
    <div className={containerClassName}>
      {label && <span className={`${styles.label} ${labelClassName || ""}`} onClick={() => setOpenSelectId(isOpen ? null : id)}>{label}</span>}
      <div ref={selectRef} className={`${styles.selectWrapper} ${selectWrapperClassName || ""}`} style={{...(label && {marginTop: "8px"}), ...(isOpen && { border: "1px solid #c3c3c3" })}} >
        <div className={`${styles.triggerWrapper} ${triggerWrapperClassName || ""}`}>
          <span
            className={`${styles.trigger} ${triggerClassName || ""}`}
            onClick={() => setOpenSelectId(isOpen ? null : id)}
          >
            <span className={styles.iconPlaceholder}>
              {iconPlaceholder && <span className={styles.iconOption}>{iconPlaceholder}</span>}
              {selectValue.icon && <span className={styles.iconOption}>{selectValue.icon}</span>}
              
              {fixedText ? fixedText : ""} {selectValue?.text || selectPlaceholder}
            </span>
            <ChevronDown
              className={`${styles.chevronIcon} ${isOpen ? styles.rotate180 : ""}`}
              size={16}
            />
          </span>
        </div>
        {isOpen && (
          <div className={`${styles.dropdownContainer} ${dropDownClassName}`}>
            {showSearchInput !== false && (
              <InputWithIcon
                icon={<Search size={16} />}
                placeholder='O que você procura?'
                value={textSearch.text}
                onInputChange={(value) => setTextSearch({ icon: textSearch.icon, text: value })}
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
                (textSearch.text === "" || option.label.toLowerCase().includes(textSearch.text.toLowerCase())) && (
                  <span
                    className={styles.optionItem}
                    key={option.value}
                    onMouseEnter={() => setHoveredOption(option.value)}
                    onMouseLeave={() => setHoveredOption(null)}
                    onClick={() => {
                      setSelectValue({ icon: option.icon, text: option.label });
                      if (onSelectStatusChange) {
                        onSelectStatusChange(option.value);
                      }
                      setOpenSelectId(isOpen ? null : id)
                    }}
                  >
                    {!option.icon && (
                      selectStatusValue !== option.value &&
                      (hoveredOption === option.value ?
                        <SquareCheck color='#093A5D' />
                        :
                        <Square className={styles.iconBorderIndigo} color='#093A5D' />
                      )
                    )}
                    {!option.icon && selectStatusValue === option.value && <SquareCheck color='#093A5D' />}
                    {option.icon && <span className={styles.iconOption}>{option.icon}</span>}
                    {option.label}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
