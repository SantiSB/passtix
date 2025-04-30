import React from 'react';

interface SelectInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: string | number; name: string }[];
  required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div className="space-y-3">
    <label className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
    >
      <option value="" className="bg-gray-800 text-gray-500">
        Selecciona
      </option>
      {options.map((option) => (
        <option className="bg-gray-800 text-white" key={option.id} value={option.id.toString()}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

export default SelectInput; 