import { TextInput, TextInputProps } from '@mantine/core';
import { forwardRef } from 'react';

/**
 * Props for CustomPhoneInput component used with react-phone-number-input
 *
 * Extends Mantine's TextInputProps, excluding `value` and `onChange`.
 * Compatible with react-phone-number-input's inputComponent prop.
 */
interface CustomPhoneInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  /** Input value, passed by react-phone-number-input */
  value?: string;

  /** Called when input changes, receives the new value */
  onChange?: (value: string) => void;

  /** Optional label displayed above the input field */
  label?: React.ReactNode;
}

/**
 * CustomPhoneInput
 *
 * A Mantine-styled input compatible with react-phone-number-input.
 * Handles forwarding ref, custom styling, and simplified onChange.
 *
 * @example
 * <PhoneInput
 *   defaultCountry="PS"
 *   inputComponent={CustomPhoneInput}
 *   value={phone}
 *   onChange={setPhone}
 * />
 */
export const CustomPhoneInput = forwardRef<HTMLInputElement, CustomPhoneInputProps>(
  ({ value, onChange, label, ...props }, ref) => (
    <TextInput
      label={label}
      ref={ref}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      size='sm'
      w='100%'
      classNames={{
        input: 'disabled:!cursor-text !bg-white placeholder:!text-sm !text-primary !font-normal',
        label: '!w-full',
      }}
      {...props}
    />
  )
);

CustomPhoneInput.displayName = 'CustomPhoneInput';
