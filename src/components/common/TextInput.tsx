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
    <label className="block text-sm font-medium text-black mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 p-3 rounded-md text-black"
    />
  </div>
);

export default TextInput; 