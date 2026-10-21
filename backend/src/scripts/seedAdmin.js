import env from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import SiteSettings from '../models/SiteSettings.js';

async function seedAdmin() {
  const email = env.adminSeed.email;
  const password = env.adminSeed.password;
  const name = env.adminSeed.name;

  if (!email || !password) {
    console.error('Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in backend/.env');
    process.exit(1);
  }

  if (password.length < 12) {
    console.error('ADMIN_SEED_PASSWORD must be at least 12 characters');
    process.exit(1);
  }

  await connectDB();
  await SiteSettings.getSingleton();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin already exists for ${email}. No password was changed.`);
    await disconnectDB();
    return;
  }

  const passwordHash = await User.hashPassword(password);
  await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'admin',
  });

  console.log(`Created admin account for ${email}. Change this password after first login.`);
  await disconnectDB();
}

seedAdmin().catch(async (err) => {
  console.error(err.message);
  await disconnectDB().catch(() => {});
  process.exit(1);
});
