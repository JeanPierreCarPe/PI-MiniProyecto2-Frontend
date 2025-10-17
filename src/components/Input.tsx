import type { ChangeEvent } from "react";

interface InputProps {
  type: string;
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="w-full h-fit flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-white">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="border-2 border-blue text-white bg-transparent rounded-sm h-10 p-2 focus:outline-none focus:border-lightblue"
      />
    </div>
  );
};

export default Input;
