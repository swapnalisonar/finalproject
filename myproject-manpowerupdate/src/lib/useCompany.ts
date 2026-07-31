import { useEffect, useState } from 'react';
import { getCompany } from './api';
import type { Company } from './types';

export function useCompany() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCompany()
      .then((c) => {
        if (!active) return;
        setCompany(c);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { company, loading };
}

export function clearCompanyCache() {}
