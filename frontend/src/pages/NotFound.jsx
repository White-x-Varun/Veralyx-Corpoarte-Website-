import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Seo from '@/components/Seo';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you are looking for could not be found." noIndex />

      <section className="not-found-page relative flex min-h-[65vh] items-center justify-center overflow-hidden section-padding">
        <div className="not-found-orbit" aria-hidden="true" />
        <div className="container-app relative text-center">
          <p className="not-found-code font-display font-medium">404</p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-brand-light">Page not found</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">This page missed its destination.</h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
            The page you are looking for does not exist or may have been moved.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/">
              <Button className="gap-2">
                <Home className="h-4 w-4" aria-hidden="true" />
                Go home
              </Button>
            </Link>
            <button type="button" onClick={() => window.history.back()} className="inline-flex">
              <Button variant="secondary" className="gap-2">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Go back
              </Button>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
