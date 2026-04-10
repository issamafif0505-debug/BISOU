import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

const base =
  'w-full appearance-none rounded-[12px] border bg-black-soft px-4 py-3 pr-10 text-cream ' +
  'transition-colors duration-bisou ease-bisou ' +
  'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed font-sans';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, options, placeholder, required, className, id, ...props },
  ref,
) {
  const selectId = id ?? `select-${props.name ?? Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={selectId} className="text-xs uppercase tracking-[0.14em] text-grey font-sans">
          {label}
          {required ? <span className="text-gold"> *</span> : null}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          className={cn(base, error ? 'border-status-red' : 'border-white/10', className)}
          required={required}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gold"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {hint && !error ? <p className="text-xs text-grey">{hint}</p> : null}
      {error ? (
        <p className="text-xs text-status-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default Select;
