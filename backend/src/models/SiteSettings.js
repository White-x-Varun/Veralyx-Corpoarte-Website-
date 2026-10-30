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
    tagline: { type: String, default: 'Digital marketing, PR management, social media, business consulting, and life coaching.' },
    description: {
      type: String,
      default:
        'Veralyx offers digital marketing, PR management, and social media services, alongside business consulting and life coaching.',
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
    phone: { type: String, default: '9627665099', trim: true },
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
    title: 'Digital Marketing',
    description: 'Digital marketing strategy and channel guidance shaped around business goals.',
    icon: 'chart',
  },
  {
    title: 'PR Management',
    description: 'Communications planning and media outreach aligned with your brand and business goals.',
    icon: 'megaphone',
  },
  {
    title: 'Social Media',
    description: 'Social media strategy, content direction, and audience engagement.',
    icon: 'share',
  },
  {
    title: 'Business Consulting',
    description: 'Clarify priorities, assess opportunities, and plan practical next steps.',
    icon: 'handshake',
  },
  {
    title: 'Life Coaching',
    description: 'One-to-one coaching for personal clarity, goal-setting, and follow-through.',
    icon: 'circle',
  },
];

const DEFAULT_SETTINGS = {
  companyName: 'Veralyx',
  logoUrl: '',
  tagline: 'Digital marketing, PR management, social media, business consulting, and life coaching.',
  description:
    'Veralyx offers digital marketing, PR management, and social media services, alongside business consulting and life coaching.',
  heroTitle: 'Marketing is an investment.',
  heroSubtitle: 'Strategy turns it into commercial value.',
  mission:
    'Build focused Go-to-Market, demand generation, and customer acquisition systems that turn marketing investment into measurable commercial value.',
  vision:
    'Help founders and leadership teams make marketing a disciplined driver of qualified opportunities and efficient growth.',
  team: [],
  milestones: [],
  email: 'veralyx91@gmail.com',
  phone: '9627665099',
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
