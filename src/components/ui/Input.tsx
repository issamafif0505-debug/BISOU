'use client';

import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface BaseFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const fieldBase =
  'w-full rounded-[12px] border bg-black-soft px-4 py-3 text-cream placeholder:text-grey/60 ' +
  'transition-colors duration-bisou ease-bisou ' +
  'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed font-sans';

const borderOk = 'border-white/10';
const borderErr = 'border-status-red';

// ─── Input (text/email/tel/password/etc.) ────────────────────
interface InputProps extends BaseFieldProps, InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, required, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? `input-${props.name ?? generatedId}`;
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-xs uppercase tracking-[0.14em] text-grey font-sans">
          {label}
          {required ? <span className="text-gold"> *</span> : null}
        </label>
      ) : null}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={cn(fieldBase, error ? borderErr : borderOk, className)}
        required={required}
        {...props}
      />
      {hint && !error ? (
        <p id={`${inputId}-hint`} className="text-xs text-grey">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-status-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

// ─── Textarea ────────────────────────────────────────────────
interface TextareaProps extends BaseFieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, required, className, id, rows = 4, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? `textarea-${props.name ?? generatedId}`;
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={textareaId} className="text-xs uppercase tracking-[0.14em] text-grey font-sans">
          {label}
          {required ? <span className="text-gold"> *</span> : null}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        className={cn(fieldBase, 'resize-y min-h-[96px]', error ? borderErr : borderOk, className)}
        required={required}
        {...props}
      />
      {hint && !error ? (
        <p id={`${textareaId}-hint`} className="text-xs text-grey">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${textareaId}-error`} className="text-xs text-status-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
