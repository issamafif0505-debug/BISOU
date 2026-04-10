/**
 * <CitySelect />
 * ---------------
 * Thin wrapper around <Select /> for the COD checkout city dropdown.
 * Accepts the list of cities as a prop (loaded server-side in the page)
 * so no client-side fetch is needed.
 */

'use client';

import { forwardRef } from 'react';
import { Select, type SelectOption } from '@/components/ui/Select';

export type CityOption = {
  slug: string;
  name_fr: string;
};

interface CitySelectProps {
  cities: CityOption[];
  name?: string;
  id?: string;
  error?: string;
  required?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const CitySelect = forwardRef<HTMLSelectElement, CitySelectProps>(
  function CitySelect({ cities, error, ...rest }, ref) {
    const options: SelectOption[] = cities.map((c) => ({
      value: c.slug,
      label: c.name_fr,
    }));

    return (
      <Select
        ref={ref}
        label="Ville"
        required
        placeholder="Sélectionnez votre ville"
        options={options}
        error={error}
        {...rest}
      />
    );
  },
);

export default CitySelect;
