import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  FolderKanban,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Star,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import Seo from '@/components/Seo';

const SIDEBAR_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/admin/applications', label: 'Applications', icon: Inbox },
  { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/profile', label: 'Profile', icon: User },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { companyName } = useSettings();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navClass = ({ isActive }) =>
    cn(
      'admin-nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
      isActive
        ? 'admin-nav-link--active bg-brand/15 text-brand-light'
        : 'text-slate-400 hover:bg-white/5 hover:text-white',
    );

  const Sidebar = ({ mobile = false }) => (
    <div className={cn('admin-sidebar-inner flex h-full flex-col', mobile ? 'p-4' : '')}>
      <div className="admin-brand-lockup mb-8 px-3">
        <Link to="/" className="inline-flex items-center gap-3 font-display text-lg font-semibold text-white">
          <span className="admin-brand-mark"><Sparkles className="h-4 w-4" aria-hidden="true" /></span>
          {companyName}
        </Link>
        <p className="mt-2 text-xs text-muted">Growth workspace <span aria-hidden="true">/</span> Admin</p>
      </div>
      <nav className="flex-1 space-y-1" aria-label="Admin navigation">
        {SIDEBAR_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={navClass}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="admin-user-block mt-auto border-t border-surface-border pt-4">
        <p className="mb-3 truncate px-3 text-xs text-muted">{user?.email}</p>
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Seo title="Admin" noIndex />
      <div id="admin-root" className="admin-shell flex min-h-screen bg-navy">
        <aside className="admin-sidebar hidden w-64 shrink-0 border-r border-surface-border bg-surface/50 lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto p-4">
            <Sidebar />
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside className="relative h-full w-64 bg-surface-elevated shadow-card">
              <button
                type="button"
                className="absolute right-4 top-4 rounded p-1 text-muted hover:text-white"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
              <Sidebar mobile />
            </aside>
          </div>
        )}

        <div className="admin-main flex min-w-0 flex-1 flex-col">
          <header className="admin-topbar flex h-16 items-center gap-4 border-b border-surface-border px-4 lg:px-8">
            <button
              type="button"
              className="rounded-lg p-2 text-muted hover:bg-white/5 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <p className="admin-topbar-kicker">Veralyx / Workspace</p>
              <h1 className="font-display text-base font-semibold text-white">Administration</h1>
            </div>
            <span className="admin-session-chip hidden items-center gap-2 sm:inline-flex"><i /> Secure session</span>
          </header>
          <main className="admin-content flex-1 p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
