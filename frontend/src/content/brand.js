export const BRAND = {
  name: 'Veralyx',
  legalEntity: 'Vibgyor Horizons Private Limited',
  legalLine: 'Veralyx is a brand of and is operated by Vibgyor Horizons Private Limited.',
  email: 'veralyx91@gmail.com',
  founderLinkedInUrl: 'https://www.linkedin.com/in/rahulgoel091/',
  companyLinkedInUrl: '',
  companyLinkedInEmbedUrl: '',
  whatsappUrl: 'https://lnkd.in/gAD3wmTS',
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/rahulgoel091/',
    facebook: 'https://facebook.com/share/1A7RsE9BcE',
    youtube: 'https://m.youtube.com/@Veralyx91',
  },
  tagline: 'Digital marketing consulting, business consulting, and life coaching.',
  description:
    'Veralyx offers digital marketing consulting and business consulting for organizations, and life coaching for individuals.',
  heroTitle: 'Build with clarity.',
  heroSubtitle: 'Consulting for businesses. Coaching for individuals.',
  mission:
    'Help organizations make focused marketing and business decisions, and support individuals as they work toward meaningful personal goals.',
  vision:
    'Bring clearer thinking to business growth and personal progress through consulting and coaching.',
};

export const SOCIAL_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'twitter', label: 'X' },
];

export const FOUNDER_STATS = [
  { target: 9, value: '9+', label: 'Years of experience of the founder', suffix: '+' },
  { target: 12, value: '12+', label: 'Industries the founder has worked in', suffix: '+' },
  { target: 1100, value: '1,100+', label: 'Clients served through the founder’s work', suffix: '+' },
  { target: 9000, value: '9K+', label: 'Founder’s LinkedIn and YouTube audience', suffix: '+', compact: true },
  { target: 20, value: '₹20L+', label: 'Monthly ad budgets optimized by the founder', prefix: '₹', suffix: 'L+' },
  { target: 7, value: '₹7+ Cr', label: 'Revenue contribution from the founder’s work', prefix: '₹', suffix: '+ Cr' },
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
  'Marketing and sales in sync',
];

export const SERVICES = [
  {
    slug: 'digital-marketing-consulting',
    icon: 'chart',
    title: 'Digital Marketing Consulting',
    description: 'Practical marketing strategy and channel guidance shaped around business goals.',
    content:
      'Veralyx advises organizations on digital marketing priorities, Go-to-Market planning, demand generation, and customer acquisition. The scope is agreed around each client’s goals and resources.',
    features: [
      'Go-to-Market planning',
      'Demand generation and customer acquisition',
      'SEO, paid media, positioning, and conversion guidance',
    ],
  },
  {
    slug: 'business-consulting',
    icon: 'handshake',
    title: 'Business Consulting',
    description: 'Clarify business priorities, assess opportunities, and plan practical next steps.',
    content:
      'Veralyx works with founders and teams to review business priorities, consider growth opportunities, and shape clear next steps. The work is advisory and tailored to the engagement agreed with the client.',
    features: [
      'Business goals and priority review',
      'Growth opportunity assessment',
      'Practical planning and decision support',
    ],
  },
  {
    slug: 'life-coaching',
    icon: 'circle',
    title: 'Life Coaching',
    description: 'One-to-one coaching for personal clarity, goal-setting, and follow-through.',
    content:
      'Life coaching provides a structured space to reflect, clarify personal goals, and plan actions that fit your priorities. Coaching is non-clinical and is not therapy, mental-health treatment, or medical advice.',
    features: [
      'Personal goal-setting',
      'Reflection and decision support',
      'Accountability for agreed actions',
    ],
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

