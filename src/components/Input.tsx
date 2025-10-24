import type { ChangeEvent } from "react";

/**
 * Props for the Input component
 * @typedef {Object} InputProps
 * @property {string} type - HTML input type (text, email, password, number, etc.)
 * @property {string} id - Unique input ID to associate with the label
 * @property {string} label - Label text displayed above the input
 * @property {string} placeholder - Input placeholder text
 * @property {string} [value] - Controlled input value
 * @property {Function} [onChange] - Callback executed when input value changes
 * @property {boolean} [required] - Whether the field is required (default: false)
 */
interface InputProps {
  type: string;
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

/**
 * Reusable input component with label and custom styles
 * Includes blue border styles with focus effect
 * 
 * @component
 * @param {InputProps} props - Component props
 * @returns {JSX.Element} Rendered input with label
 * 
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   id="user-email"
 *   label="Email"
 *   placeholder="your@email.com"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   required
 * />
 * ```
 */
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
        className="border-2 border-white/75 text-white bg-transparent rounded-sm h-10 p-2 focus:outline-none focus:border-lightblue"
      />
    </div>
  );
};

export default Input;
