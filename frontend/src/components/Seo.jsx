import { Helmet } from 'react-helmet-async';
import { useSettings } from '@/context/SettingsContext';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';

export default function Seo({
  title,
  description,
  path = '',
  image,
  type = 'website',
  noIndex = false,
}) {
  const { companyName } = useSettings();
  const pageTitle = title ? `${title} | ${companyName}` : companyName;
  const pageDescription = description || `${companyName} — strategy, creativity, and technology for measurable growth.`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/favicon.svg`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
    </Helmet>
  );
}
