import React from 'react';

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  type = 'text',
  required = false,
  value,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
    />
  </div>
);

export default TextInput; 