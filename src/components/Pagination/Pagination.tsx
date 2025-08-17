'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import style from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [inputValue, setInputValue] = useState(currentPage.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const changeTimeoutRef = useRef<NodeJS.Timeout>(null);
  const t = useTranslations('pagination');

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (changeTimeoutRef.current) {
      clearTimeout(changeTimeoutRef.current);
    }
    changeTimeoutRef.current = setTimeout(() => {
      processPageChange(value);
    }, 800);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') processPageChange(inputValue);
  };

  const processPageChange = (value: string) => {
    const page = parseInt(value, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    } else {
      setInputValue(currentPage.toString());
    }
  };

  return (
    <div className={style.pagination}>
      <button onClick={handlePrev} disabled={currentPage === 1} className={style.button}>
        {t('previous')}
      </button>

      {t('page')}

      <div className={style.pageInputContainer}>
        <input
          ref={inputRef}
          type="number"
          min="1"
          max={totalPages}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={style.pageInput}
        />
        <span className={style.pageTotal}>
          {t('of')} {totalPages}
        </span>
      </div>

      <button onClick={handleNext} disabled={currentPage === totalPages} className={style.button}>
        {t('next')}
      </button>
    </div>
  );
};
