import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError | string;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

function InputField({
  label,
  type,
  register,
  name,
  defaultValue,
  error,
  inputProps,
  hidden,
}: InputFieldProps) {
  const errorMessage = typeof error === "string" ? error : error?.message;
  return (
    <div
      className={`flex flex-col gap-2 w-full md:w-1/4 ${
        hidden ? "hidden" : ""
      }`}
    >
      <label htmlFor={name} className="text-xs text-gray-500 gap-0">
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        defaultValue={defaultValue}
        {...inputProps}
      />
      {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}
    </div>
  );
}

export default InputField;
