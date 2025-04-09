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
    <label className="block text-sm font-medium text-black">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border p-3 rounded-md bg-white text-black"
    >
      <option value="" className="text-gray-500">
        Selecciona
      </option>
      {options.map((option) => (
        <option className="text-black" key={option.id} value={option.id.toString()}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

export default SelectInput; 