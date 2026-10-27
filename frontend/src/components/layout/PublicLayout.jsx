import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
<<<<<<< HEAD
import SiteAssistant from '@/components/SiteAssistant';
=======
>>>>>>> 43c96cae5a41dff2359aa9aa24c4da4db4ccc17d

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
<<<<<<< HEAD
      <SiteAssistant />
=======
>>>>>>> 43c96cae5a41dff2359aa9aa24c4da4db4ccc17d
    </div>
  );
}
