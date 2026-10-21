import Seo from '@/components/Seo';
import { useSettings } from '@/context/SettingsContext';
import { resolveEmail } from '@/content/brand';
import PageHero from '@/components/brand/PageHero';

export default function PrivacyPolicy() {
  const { settings, companyName } = useSettings();
  const email = resolveEmail(settings);

  return (
    <>
      <Seo title="Privacy Policy" description={`Privacy policy for ${companyName}.`} path="/privacy-policy" />

      <PageHero
        eyebrow="Legal · Privacy"
        title="Privacy Policy"
        subtitle={`Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      <section className="section-padding pt-0">
        <div className="container-app max-w-3xl prose-content">
          <p>
            This website is for the Veralyx brand and is operated by Vibgyor Horizons Private Limited
            (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). We respect your privacy and are committed to protecting
            your personal data. This policy describes how we collect, use, and safeguard information when you visit our website
            or interact with our services.
          </p>

          <h2>Information we collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>Contact information you provide through forms (name, email, phone number)</li>
            <li>Application materials submitted through our careers portal</li>
            <li>Technical data such as IP address, browser type, and device information</li>
            <li>Usage data about how you interact with our website</li>
          </ul>

          <h2>How we use your information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Respond to inquiries and provide requested services</li>
            <li>Process job applications</li>
            <li>Improve our website and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Data sharing</h2>
          <p>
            We do not sell your personal data. We may share information with trusted service providers who assist
            in operating our website, subject to confidentiality agreements.
          </p>

          <h2>Data retention</h2>
          <p>
            We retain personal data only as long as necessary for the purposes outlined in this policy or as required by law.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict processing of your personal data.
            Contact us at {email} to exercise these rights.
          </p>

          <h2>Cookies</h2>
          <p>
            Our website may use essential cookies for functionality and session management. We do not use third-party advertising cookies.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy-related questions, contact us at {email} or through our contact page.
          </p>
        </div>
      </section>
    </>
  );
}
