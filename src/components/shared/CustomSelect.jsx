import { useState, useEffect, useRef } from 'react';
import styles from './CustomSelect.module.css';
import { capitalizeText } from '../../utils/capitalizeText';

const CustomSelect = ({ options, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
 
  const selectedOption = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className={`${styles.container} ${className}`} ref={selectRef}>
      <div 
        className={`${styles.trigger} ${isOpen ? styles.open : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{capitalizeText(selectedOption?.label)}</span>
        <span className={styles.arrow}></span>
      </div>
      
      {isOpen && (
        <ul className={styles.options}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`${styles.option} ${selectedOption?.value === option.value ? styles.selected : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {capitalizeText(option.label)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;