type TextInputWithCounterProps = {
  inputClassName?: string;
  maxLength: number;
  onChange: (value: string) => void;
  onFocus?: () => void;
  placeholder: string;
  value: string;
  wrapperClassName?: string;
};

export const TextInputWithCounter = ({
  inputClassName,
  maxLength,
  onChange,
  onFocus,
  placeholder,
  value,
  wrapperClassName,
}: TextInputWithCounterProps) => {
  return (
    <div
      className={`flex items-center rounded-lg border border-green bg-white px-4 py-3 ${
        wrapperClassName ?? ''
      }`}>
      <input
        type="text"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400 ${
          inputClassName ?? ''
        }`}
      />
      <span className="ml-3 text-sm text-gray-500">
        {value.length}/{maxLength}
      </span>
    </div>
  );
};
