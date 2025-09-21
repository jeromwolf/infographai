import React from 'react';

export const Select = ({
  children,
  value,
  onValueChange,
  className = ''
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={`block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      {children}
    </select>
  );
};

export const SelectTrigger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <>{children}</>
);

export const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const SelectItem = ({
  children,
  value
}: {
  children: React.ReactNode;
  value: string;
}) => (
  <option value={value}>{children}</option>
);

export const SelectValue = ({ placeholder = '' }: { placeholder?: string }) => (
  <option value="" disabled>{placeholder}</option>
);