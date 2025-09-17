import React, { useState } from 'react';
import { useTheme } from "../context/ThemeContext";

function Pagination({ nextFn, prevFn, pageNo, maxPage, onPageChange }) {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState(pageNo);

  // Sync input value with pageNo prop
  React.useEffect(() => {
    setInputValue(pageNo);
  }, [pageNo]);

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(val);
  };

  const handleInputBlur = () => {
    let page = Number(inputValue);
    if (!page || page < 1) page = 1;
    if (maxPage && page > maxPage) page = maxPage;
    if (page !== pageNo && onPageChange) {
      onPageChange(page);
    }
    setInputValue(page);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-4">
      <div className={`flex items-center gap-4 sm:gap-8 ${colors.card} rounded-xl shadow-lg px-4 sm:px-8 py-2`}>
        <button
          onClick={prevFn}
          className={`flex items-center justify-center ${colors.buttonPrimary} font-bold rounded-full w-10 h-10 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Previous Page"
          disabled={pageNo === 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className={`w-14 sm:w-16 text-center text-lg sm:text-xl font-bold ${colors.input} ${colors.inputFocus} rounded-md px-2 py-1 transition-all`}
          aria-label="Page number"
        />
        <span className={`text-sm ${colors.textSecondary} select-none`}>/ {maxPage || '...'}</span>
        <button
          onClick={nextFn}
          className={`flex items-center justify-center ${colors.buttonPrimary} font-bold rounded-full w-10 h-10 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Next Page"
          disabled={maxPage && pageNo >= maxPage}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Pagination;