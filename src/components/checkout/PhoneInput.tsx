/**
 * <PhoneInput />
 * ---------------
 * Wrapper around <Input /> for Moroccan phone numbers. Adds a visible
 * `+212` prefix affordance via placeholder and inputMode="tel".
 */

'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/Input';

interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput(
    { label = 'Téléphone', error, required = true, placeholder, ...rest },
    ref,
  ) {
    return (
      <Input
        ref={ref}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        label={label}
        required={required}
        placeholder={placeholder ?? '0612345678 ou +212612345678'}
        pattern="^(0[5-7][0-9]{8}|(\+?212)[5-7][0-9]{8})$"
        error={error}
        hint="Format marocain : 10 chiffres ou +212 suivi de 9 chiffres"
        {...rest}
      />
    );
  },
);

export default PhoneInput;
