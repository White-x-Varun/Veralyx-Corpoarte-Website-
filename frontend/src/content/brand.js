export const BRAND = {
  name: 'Veralyx',
  legalEntity: 'Vibgyor Horizons Private Limited',
  legalLine: 'Veralyx is a brand of, and is operated by, Vibgyor Horizons Private Limited.',
  email: 'veralyx91@gmail.com',
  whatsappUrl: 'https://lnkd.in/gAD3wmTS',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/rahul-director-a41959375',
    facebook: 'https://facebook.com/share/1A7RsE9BcE',
    youtube: 'https://m.youtube.com/@Veralyx91',
  },
  tagline: 'Go-to-Market strategy, demand generation, and customer acquisition.',
  description:
    'Veralyx partners with founders and leadership teams to build focused Go-to-Market, demand generation, and customer acquisition systems that support measurable business outcomes.',
  heroTitle: 'Marketing is an investment.',
  heroSubtitle: 'Strategy turns it into commercial value.',
  mission:
    'Build focused Go-to-Market, demand generation, and customer acquisition systems that turn marketing investment into measurable commercial value.',
  vision:
    'Help founders and leadership teams make marketing a disciplined driver of qualified opportunities and efficient growth.',
};

export const SOCIAL_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'twitter', label: 'X' },
];

export const FOUNDER_STATS = [
  { value: '9+', label: 'Years of experience' },
  { value: '1,100+', label: 'Clients' },
  { value: '12+', label: 'Industries' },
  { value: '₹7+ Cr', label: 'Revenue contribution' },
  { value: '₹5L+', label: 'Monthly ad budgets optimized' },
  { value: '9K+', label: 'LinkedIn & YouTube audience' },
];

export const INDUSTRIES = [
  'Healthcare',
  'SaaS',
  'D2C',
  'Technology',
  'Logistics',
  'B2B',
  'Professional Services',
];

export const EXPERTISE = [
  'GTM Strategy',
  'Demand Generation',
  'Performance Marketing',
  'SEO & SEM',
  'Paid Media',
  'CRO',
  'Brand Positioning',
  'Marketing & Sales Alignment',
];

export const SERVICES = [
  {
    slug: 'go-to-market-strategy',
    icon: 'target',
    title: 'Go-to-Market Strategy',
    description: 'Focused market, audience, positioning, and channel choices tied to business goals.',
    content:
      'Veralyx partners with founders and leadership teams to shape focused Go-to-Market plans. We align market priorities, positioning, channels, and measurement around the commercial outcomes the business needs.',
    features: [
      'Market and audience prioritization',
      'Positioning, messaging, and channel strategy',
      'Commercial goals and measurement',
    ],
  },
  {
    slug: 'demand-generation',
    icon: 'megaphone',
    title: 'Demand Generation',
    description: 'Build campaigns and journeys that create qualified opportunities.',
    content:
      'We build demand generation systems that connect the right audiences with relevant offers and clear next steps. Campaigns focus on qualified opportunities and visible performance.',
    features: [
      'Audience and offer planning',
      'Lead generation campaigns',
      'Opportunity quality and funnel measurement',
    ],
  },
  {
    slug: 'performance-marketing',
    icon: 'chart',
    title: 'Performance Marketing',
    description: 'Optimize paid media investment around efficient customer acquisition.',
    content:
      'Veralyx plans and optimizes performance marketing across paid channels, with attention to acquisition efficiency, campaign quality, and the business outcomes behind the numbers.',
    features: [
      'Paid media planning and optimization',
      'Acquisition cost and conversion analysis',
      'Campaign testing and reporting',
    ],
  },
  {
    slug: 'seo-sem-paid-media',
    icon: 'search',
    title: 'SEO, SEM & Paid Media',
    description: 'Improve discoverability and capture high-intent demand across search and paid channels.',
    content:
      'Search and paid media work together to help the right customers find and choose a business. We connect search intent, campaign structure, landing pages, and measurement.',
    features: [
      'SEO and search opportunity planning',
      'SEM and paid media campaigns',
      'Channel performance measurement',
    ],
  },
  {
    slug: 'cro-brand-positioning',
    icon: 'cursor',
    title: 'CRO & Brand Positioning',
    description: 'Make the value clear and improve the path from interest to conversion.',
    content:
      'Clear positioning and a thoughtful conversion journey help marketing perform better. We improve how the offer is communicated and remove friction from key customer actions.',
    features: [
      'Brand and offer positioning',
      'Landing page and funnel reviews',
      'Conversion rate optimization',
    ],
  },
  {
    slug: 'marketing-sales-alignment',
    icon: 'handshake',
    title: 'Marketing & Sales Alignment',
    description: 'Connect marketing activity with how teams qualify, follow up, and close opportunities.',
    content:
      'Marketing and sales work best when both teams share definitions, context, and feedback. We help connect demand generation to qualification and sales follow-up so commercial opportunities move forward.',
    features: [
      'Lead and opportunity definitions',
      'Handoff and follow-up alignment',
      'Shared feedback and reporting',
    ],
  },
];

export const INTERNSHIP_ROLES = [
  { title: 'Graphic Design', summary: 'Visual work and campaign assets.' },
  { title: 'B2B Sales', summary: 'Outreach and relationship support.' },
  { title: 'B2C Sales & Business Development', summary: 'Outreach and partnership support.' },
  { title: 'Social Media', summary: 'Content and platform presence.' },
  { title: 'Content', summary: 'Writing and storytelling support.' },
  { title: 'Marketing', summary: 'Campaign and positioning support.' },
  { title: 'Operations', summary: 'Coordination and delivery support.' },
];

export const INTERNSHIP_PATH = [
  {
    step: '01',
    title: 'First 3 months',
    description: 'Unpaid internship focused on learning, contribution, and fit. Terms are confirmed in writing if selected.',
  },
  {
    step: '02',
    title: 'From the 4th month',
    description: 'Paid internship may be offered based on performance. This is not automatic.',
  },
  {
    step: '03',
    title: 'Further work',
    description: 'Further paid work is considered only if offered in writing. Applying is not a job offer.',
  },
];

export function isPlaceholderValue(value) {
  if (!value) return true;
  const v = String(value).toLowerCase();
  return (
    v.includes('example.com') ||
    v.includes('placeholder') ||
    v.includes('+1-555') ||
    v.includes('your ')
  );
}

export function resolveEmail(settings) {
  const email = settings?.email;
  return isPlaceholderValue(email) ? BRAND.email : email;
}

export function applyMailto(role) {
  const subject = encodeURIComponent(role ? `Application — ${role}` : 'Application — Veralyx');
  const body = encodeURIComponent(
    `Hello Veralyx,\n\nI am applying for: ${role || '[role]'}\n\nIntroduction:\n\n`,
  );
  return `mailto:${BRAND.email}?subject=${subject}&body=${body}`;
}
