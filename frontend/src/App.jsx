import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Spinner from '@/components/ui/Spinner';

// Public pages — eager load for faster first paint on main routes
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Careers from '@/pages/Careers';
import JobDetail from '@/pages/JobDetail';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';

// Admin pages — code-split
const AdminLogin = lazy(() => import('@/pages/admin/Login'));
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Jobs = lazy(() => import('@/pages/admin/Jobs'));
const JobForm = lazy(() => import('@/pages/admin/JobForm'));
const Applications = lazy(() => import('@/pages/admin/Applications'));
const Enquiries = lazy(() => import('@/pages/admin/Enquiries'));
const BlogAdmin = lazy(() => import('@/pages/admin/BlogAdmin'));
const BlogForm = lazy(() => import('@/pages/admin/BlogForm'));
const ProjectsAdmin = lazy(() => import('@/pages/admin/ProjectsAdmin'));
const ProjectForm = lazy(() => import('@/pages/admin/ProjectForm'));
const Testimonials = lazy(() => import('@/pages/admin/Testimonials'));
const Settings = lazy(() => import('@/pages/admin/Settings'));
const Profile = lazy(() => import('@/pages/admin/Profile'));

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy">
      <Spinner size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="careers" element={<Careers />} />
          <Route path="careers/:slug" element={<JobDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />

        <Route
          path="admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <ProtectedRoute />
            </Suspense>
          }
        >
          <Route
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/new" element={<JobForm />} />
            <Route path="jobs/:id/edit" element={<JobForm />} />
            <Route path="applications" element={<Applications />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="blog/new" element={<BlogForm />} />
            <Route path="blog/:id/edit" element={<BlogForm />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id/edit" element={<ProjectForm />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
