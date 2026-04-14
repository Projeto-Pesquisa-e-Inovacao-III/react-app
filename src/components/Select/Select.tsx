import { ChevronDown, Search, Square, SquareCheck } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import InputWithIcon from '../Inputs/InputWithIcon/InputWithIcon';
import styles from './Select.module.css';
import useClickOutside from '../../hooks/useClickOutside';
import classNames from 'classnames';

type Props = {
  id: string;
  openSelectId: string | null;
  setOpenSelectId: (id: string | null) => void;
  onSelectStatusChange: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
  selectStatusValue?: string;
  values?: Array<{ icon?: React.ReactNode; label: string; value: string; disabled?: boolean }>;

  selectPlaceholder?: string;
  iconPlaceholder?: React.ReactNode;

  showSelectAll?: boolean;
  showSearchInput?: boolean;
  defaultValue?: string;
  fixedText?: string;
  label?: React.ReactNode;

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

  const [selectValue, setSelectValue] = useState<{ icon: React.ReactNode, text: string }>({ icon: undefined, text: "" });

  const selectRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: selectRef,
    callback: () => {
      if (isOpen) {
        setOpenSelectId(null);
      }
    }
  });

  useEffect(() => {
    if (clear && clear === true) {
      setSelectValue({ icon: undefined, text: "" });
      if (onSelectStatusChange) {
        onSelectStatusChange("");
      }

      setTextSearch({ icon: undefined, text: "" });

    }
  }, [clear])

  useEffect(() => {
    if (defaultValue) {
      const defaultOption = values?.find(option => option.value === defaultValue);
      setSelectValue({ icon: defaultOption?.icon, text: defaultOption?.label || "" });
    } else {
      setSelectValue({ icon: undefined, text: "" });
    }
  }, [defaultValue]);

  return (
    <div className={containerClassName}>
      {label && <span className={`${styles.label} ${labelClassName || ""}`} onClick={() => setOpenSelectId(isOpen ? null : id)}>{label}</span>}
      <div ref={selectRef} className={`${styles.selectWrapper} ${selectWrapperClassName || ""}`} style={{ ...(label && { marginTop: "8px" }), ...(isOpen && { border: "1px solid #c3c3c3" }) }} >
        <div className={`${styles.triggerWrapper} ${triggerWrapperClassName || ""}`}>
          <div
            className={`${styles.trigger} ${triggerClassName || ""}`}
            onClick={() => setOpenSelectId(isOpen ? null : id)}
          >
            <span className={styles.iconPlaceholder}>
              {iconPlaceholder && !selectValue.icon && <span className={styles.iconOption}>{iconPlaceholder}</span>}
              {selectValue.icon && <span className={styles.iconOption}>{selectValue.icon}</span>}
              <span className={styles.textContent}>
                {fixedText ? fixedText : ""} {selectValue?.text || selectPlaceholder}
              </span>
            </span>
            <ChevronDown
              className={`${styles.chevronIcon} ${isOpen ? styles.rotate180 : ""}`}
              size={16}
            />
          </div>
        </div>
        {isOpen && (
          <div className={`${styles.dropdownContainer} ${dropDownClassName}`}>
            {showSearchInput !== false && (
              <InputWithIcon
                icon={<Search size={16} />}
                placeholder='O que você procura?'
                value={textSearch.text}
                onInputChange={(value: string) => setTextSearch({ icon: textSearch.icon, text: value })}
                type='text'
                customClassName={"p-3"}
              />
            )}
            <div className={styles.optionsList}>
              {showSelectAll !== false && (
                <span
                  className={styles.optionItem}
                  onClick={() => onSelectStatusChange && onSelectStatusChange("")}
                >
                  {selectStatusValue !== "" ? (
                    <>
                      <Square className={`${styles.iconBorderIndigo || ""} ${styles.defaultIcon}`} color='#093A5D' />
                      <SquareCheck className={styles.hoverIcon} color='#093A5D' />
                    </>
                  ) : (
                    <SquareCheck color='#093A5D' />
                  )}

                  Selecionar todos
                </span>
              )}
              {values && values.map((option) => (
                (textSearch.text === "" || option.label.toLowerCase().includes(textSearch.text.toLowerCase())) && (
                  <span
                    className={classNames(styles.optionItem, { [styles.disabled]: option.disabled })}
                    key={option.value}
                    onClick={() => {
                      if(setSelectValue && !option.disabled) {
                        setSelectValue({ icon: option.icon, text: option.label });
                      }
                      if (onSelectStatusChange) {
                        onSelectStatusChange(option.value);
                        setOpenSelectId(isOpen ? null : id)
                      }
                    }}
                  >
                    {!option.icon && (
                      selectStatusValue !== option.value ? (
                        <>
                          <Square className={`${styles.iconBorderIndigo || ""} ${styles.defaultIcon}`} color='#093A5D' />
                          <SquareCheck className={styles.hoverIcon} color='#093A5D' />
                        </>
                      ) : (
                        <SquareCheck color='#093A5D' />
                      )
                    )}
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
