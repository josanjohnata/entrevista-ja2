import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import * as S from './styles';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  values: string[];
  onChange: (values: string[]) => void;
  options: Option[];
  id?: string;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  values,
  onChange,
  options,
  id,
  placeholder = 'Selecione...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter(opt => values.includes(opt.value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter(v => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter(v => v !== optionValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <S.SelectWrapper ref={wrapperRef}>
      <S.MultiSelectButton
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        $isOpen={isOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <S.MultiSelectContent>
          {selectedOptions.length === 0 ? (
            <S.MultiSelectPlaceholder>{placeholder}</S.MultiSelectPlaceholder>
          ) : (
            <S.TagsContainer>
              {selectedOptions.map((option) => (
                <S.Tag key={option.value}>
                  {option.label}
                  <S.TagRemove
                    type="button"
                    onClick={(e) => handleRemove(option.value, e)}
                    aria-label={`Remover ${option.label}`}
                  >
                    <X size={11} />
                  </S.TagRemove>
                </S.Tag>
              ))}
            </S.TagsContainer>
          )}
        </S.MultiSelectContent>
        <S.SelectIcon $isOpen={isOpen}>
          <ChevronDown size={16} />
        </S.SelectIcon>
      </S.MultiSelectButton>

      <S.SelectDropdown $isOpen={isOpen} role="listbox">
        {options.map((option) => {
          const isSelected = values.includes(option.value);
          return (
            <S.MultiSelectOption
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              $isSelected={isSelected}
              role="option"
              aria-selected={isSelected}
            >
              <S.Checkbox $isChecked={isSelected}>
                {isSelected && <Check size={12} />}
              </S.Checkbox>
              {option.label}
            </S.MultiSelectOption>
          );
        })}
      </S.SelectDropdown>
    </S.SelectWrapper>
  );
};
