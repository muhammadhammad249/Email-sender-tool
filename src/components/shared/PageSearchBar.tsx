'use client';
import React, { useState } from 'react';

interface PageSearchBarProps {
  placeholder: string;
  onSearch?: (value: string) => void;
}

export function PageSearchBar({ placeholder, onSearch }: PageSearchBarProps) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className={`relative transition-all duration-300 ease-out ${focused ? 'w-full max-w-sm' : 'w-full max-w-xs'}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className={`h-4 w-4 transition-colors duration-200 ${focused ? 'text-[#3B82F6]' : 'text-[#94A3B8]'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="block w-full pl-10 pr-4 py-2 border border-[#1E293B] rounded-xl leading-5 bg-[#111827] text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] sm:text-sm transition-all shadow-inner"
      />
      {value && (
        <button
          onClick={() => { setValue(''); onSearch?.(''); }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
