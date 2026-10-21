import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
  },
  { _id: true },
);

const siteSettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: 'Veralyx', trim: true },
    logoUrl: { type: String, default: '' },
    tagline: { type: String, default: 'Go-to-Market strategy, demand generation, and customer acquisition.' },
    description: {
      type: String,
      default:
        'Veralyx partners with founders and leadership teams to build focused Go-to-Market, demand generation, and customer acquisition systems that support measurable business outcomes.',
    },
    heroTitle: { type: String, default: 'Marketing is an investment.' },
    heroSubtitle: {
      type: String,
      default: 'Strategy turns it into commercial value.',
    },
    mission: {
      type: String,
      default:
        'Build focused Go-to-Market, demand generation, and customer acquisition systems that turn marketing investment into measurable commercial value.',
    },
    vision: {
      type: String,
      default:
        'Help founders and leadership teams make marketing a disciplined driver of qualified opportunities and efficient growth.',
    },
    team: [
      {
        name: { type: String, trim: true },
        role: { type: String, trim: true, default: '' },
        bio: { type: String, default: '' },
      },
    ],
    milestones: [
      {
        year: { type: String, trim: true },
        title: { type: String, trim: true },
        description: { type: String, default: '' },
      },
    ],
    email: { type: String, default: 'veralyx91@gmail.com', trim: true },
    phone: { type: String, default: '', trim: true },
    address: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    whatsappPrefill: {
      type: String,
      default: 'Hello Veralyx, I would like to discuss Go-to-Market and customer acquisition.',
    },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com/in/rahul-director-a41959375' },
      youtube: { type: String, default: 'https://m.youtube.com/@Veralyx91' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
      facebook: { type: String, default: 'https://facebook.com/share/1A7RsE9BcE' },
      instagram: { type: String, default: '' },
    },
    services: [serviceSchema],
    seoDefaults: {
      title: { type: String, default: 'Veralyx' },
      description: {
        type: String,
        default: 'Veralyx — Go-to-Market strategy, demand generation, and customer acquisition.',
      },
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'site_settings' },
);

const DEFAULT_SERVICES = [
  {
    title: 'Go-to-Market Strategy',
    description: 'Focused market, audience, positioning, and channel choices tied to business goals.',
    icon: 'megaphone',
  },
  {
    title: 'Demand Generation',
    description: 'Build campaigns and journeys that create qualified opportunities.',
    icon: 'sparkles',
  },
  {
    title: 'Performance Marketing',
    description: 'Optimize paid media investment around efficient customer acquisition.',
    icon: 'megaphone',
  },
  {
    title: 'SEO, SEM & Paid Media',
    description: 'Improve discoverability and capture high-intent demand across search and paid channels.',
    icon: 'sparkles',
  },
  {
    title: 'CRO & Brand Positioning',
    description: 'Make the value clear and improve the path from interest to conversion.',
    icon: 'sparkles',
  },
  {
    title: 'Marketing & Sales Alignment',
    description: 'Connect marketing activity with how teams qualify, follow up, and close opportunities.',
    icon: 'megaphone',
  },
];

const DEFAULT_SETTINGS = {
  companyName: 'Veralyx',
  logoUrl: '',
  tagline: 'Go-to-Market strategy, demand generation, and customer acquisition.',
  description:
    'Veralyx partners with founders and leadership teams to build focused Go-to-Market, demand generation, and customer acquisition systems that support measurable business outcomes.',
  heroTitle: 'Marketing is an investment.',
  heroSubtitle: 'Strategy turns it into commercial value.',
  mission:
    'Build focused Go-to-Market, demand generation, and customer acquisition systems that turn marketing investment into measurable commercial value.',
  vision:
    'Help founders and leadership teams make marketing a disciplined driver of qualified opportunities and efficient growth.',
  team: [],
  milestones: [],
  email: 'veralyx91@gmail.com',
  phone: '',
  address: '',
  whatsappNumber: '',
  whatsappPrefill: 'Hello Veralyx, I would like to discuss Go-to-Market and customer acquisition.',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/rahul-director-a41959375',
    youtube: 'https://m.youtube.com/@Veralyx91',
    twitter: '',
    github: '',
    facebook: 'https://facebook.com/share/1A7RsE9BcE',
    instagram: '',
  },
  services: DEFAULT_SERVICES,
  seoDefaults: {
    title: 'Veralyx',
    description: 'Veralyx — Go-to-Market strategy, demand generation, and customer acquisition.',
  },
};

siteSettingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne().lean();
  if (!settings) {
    settings = await this.create(DEFAULT_SETTINGS);
  }
  return settings;
};

siteSettingsSchema.statics.updateSingleton = async function updateSingleton(updates) {
  const settings = await this.findOneAndUpdate(
    {},
    { ...updates, updatedAt: new Date() },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
  ).lean();
  return settings;
};

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
