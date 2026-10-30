import Seo from '@/components/Seo';
import { useSettings } from '@/context/SettingsContext';
import { resolveEmail } from '@/content/brand';
import PageHero from '@/components/brand/PageHero';

export default function Terms() {
  const { settings, companyName } = useSettings();
  const email = resolveEmail(settings);

  return (
    <>
      <Seo title="Terms of Service" description={`Terms of service for ${companyName}.`} path="/terms" />

      <PageHero
        eyebrow="Legal · Terms"
        title="Terms of Service"
        subtitle={`Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      <section className="section-padding pt-0">
        <div className="container-app max-w-3xl prose-content">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the Veralyx website and services. Veralyx is the legal name and is owned, operated, and marketed by Vibgyor Horizons Private Limited. By accessing our website, you agree to these Terms.
          </p>

          <h2>Use of website</h2>
          <p>
            You may use our website for lawful purposes only. You agree not to misuse the site, attempt unauthorized access,
            or interfere with its operation.
          </p>

          <h2>Intellectual property</h2>
          <p>
            All content on this website, including text, graphics, logos, and software, is the property of Veralyx,
            Vibgyor Horizons Private Limited, or their respective licensors and is protected by applicable intellectual property laws.
          </p>

          <h2>Services and engagements</h2>
          <p>
            Veralyx offers digital marketing, PR management, social media, business consulting, and life coaching.
            Specific scope, fees, and deliverables are agreed separately for each engagement. Information on this website does not constitute a binding offer.
          </p>

          <h2>Payments</h2>
          <p>
            Online payments are made through the Razorpay payment page for Vibgyor Horizons Private Limited, which owns and operates Veralyx. Confirm the amount and applicable engagement terms with Veralyx before paying.
            Payments are processed on Razorpay’s hosted service and are subject to its terms and privacy practices.
          </p>

          <h2>Disclaimer</h2>
          <p>
            This website is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee uninterrupted
            or error-free access. Content may be updated without notice.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Veralyx and Vibgyor Horizons Private Limited shall not be liable for any indirect, incidental,
            or consequential damages arising from your use of this website.
          </p>

          <h2>Third-party links</h2>
          <p>
            Our website may contain links to third-party sites. We are not responsible for the content or practices of those sites.
          </p>

          <h2>Changes to terms</h2>
          <p>
            We may update these Terms at any time. Continued use of the website after changes constitutes acceptance of the revised Terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these Terms may be directed to {email}, by phone at 9627665099, or through our contact page.
          </p>
        </div>
      </section>
    </>
  );
}
