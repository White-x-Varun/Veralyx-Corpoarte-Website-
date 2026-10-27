import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import client from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { BRAND } from '@/content/brand';

const DEFAULT_SETTINGS = {
  companyName: BRAND.name,
  tagline: BRAND.tagline,
  description: BRAND.description,
  email: BRAND.email,
  phone: '',
  address: '',
  whatsappNumber: '',
  socialLinks: {
    ...BRAND.socialLinks,
    instagram: '',
    twitter: '',
  },
  services: [],
  heroTitle: BRAND.heroTitle,
  heroSubtitle: BRAND.heroSubtitle,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data } = await client.get(endpoints.settings);
        const payload = data?.data && typeof data.data === 'object' ? data.data : data;
        if (!cancelled) {
          const companyName =
            !payload?.companyName || payload.companyName === 'VibgyorHorizons'
              ? BRAND.name
              : payload.companyName;
          setSettings({
            ...DEFAULT_SETTINGS,
            ...payload,
            companyName,
            socialLinks: Object.fromEntries(
              Object.keys(DEFAULT_SETTINGS.socialLinks).map((key) => [
                key,
                payload?.socialLinks?.[key] || DEFAULT_SETTINGS.socialLinks[key] || '',
              ]),
            ),
          });
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setSettings(DEFAULT_SETTINGS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ settings, loading, error, companyName: settings.companyName || BRAND.name }),
    [settings, loading, error],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
