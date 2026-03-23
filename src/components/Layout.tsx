import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { theme } from '../theme';

const layoutStyles: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
};

const sidebarStyles: React.CSSProperties = {
  width: '240px',
  background: theme.colors.sidebarBg,
  color: theme.colors.sidebarText,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${theme.colors.sidebarBorder}`,
};

const logoStyles: React.CSSProperties = {
  padding: theme.spacing.lg,
  fontSize: theme.typography.fontSize.lg,
  fontWeight: theme.typography.fontWeight.semibold,
  borderBottom: `1px solid ${theme.colors.sidebarBorder}`,
};

const navStyles: React.CSSProperties = {
  flex: 1,
  padding: theme.spacing.md,
};

const navSectionLabel: React.CSSProperties = {
  fontSize: theme.typography.fontSize.xs,
  fontWeight: theme.typography.fontWeight.semibold,
  color: theme.colors.sidebarTextMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  padding: `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.xs}`,
};

const navLinkStyles: React.CSSProperties = {
  display: 'block',
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  color: theme.colors.sidebarText,
  textDecoration: 'none',
  borderRadius: theme.radii.md,
  marginBottom: theme.spacing.xs,
  fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.medium,
};

const mainStyles: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  background: theme.colors.surfaceRaised,
  minWidth: 0,
};

const headerStyles: React.CSSProperties = {
  height: '56px',
  background: theme.colors.surface,
  borderBottom: `1px solid ${theme.colors.border}`,
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${theme.spacing.lg}`,
  boxShadow: theme.shadows.sm,
  gap: theme.spacing.lg,
};

const contentStyles: React.CSSProperties = {
  flex: 1,
  padding: theme.spacing.lg,
  overflow: 'auto',
};

const headerTabs: React.CSSProperties = {
  display: 'flex',
  gap: theme.spacing.md,
};

function HeaderTab({ to, label, isActive }: { to: string; label: string; isActive: boolean }) {
  return (
    <NavLink
      to={to}
      style={{
        textDecoration: 'none',
        fontSize: theme.typography.fontSize.sm,
        fontWeight: isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
        color: isActive ? theme.colors.primary : theme.colors.textMuted,
        borderBottom: isActive ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
        padding: `${theme.spacing.md} 0`,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {label}
    </NavLink>
  );
}

export function Layout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const isViewsSection = location.pathname.startsWith('/tasks');
  const isConfigSection = !isViewsSection;

  return (
    <div style={layoutStyles}>
      <aside style={sidebarStyles}>
        <div style={logoStyles}>Maxsight</div>
        <nav style={navStyles}>
          <div style={navSectionLabel}>Views</div>
          <NavLink
            to="/tasks"
            style={({ isActive }) => ({
              ...navLinkStyles,
              background: isActive ? theme.colors.sidebarActive : 'transparent',
              color: isActive ? theme.colors.sidebarActiveText : theme.colors.sidebarTextMuted,
            })}
          >
            Tasks
          </NavLink>

          <div style={{ ...navSectionLabel, marginTop: theme.spacing.md }}>Configuration</div>
          <NavLink
            to="/forms"
            style={({ isActive }) => ({
              ...navLinkStyles,
              background: isActive ? theme.colors.sidebarActive : 'transparent',
              color: isActive ? theme.colors.sidebarActiveText : theme.colors.sidebarTextMuted,
            })}
          >
            Manage forms
          </NavLink>
          <NavLink
            to="/forms/new"
            style={({ isActive }) => ({
              ...navLinkStyles,
              background: isActive ? theme.colors.sidebarActive : 'transparent',
              color: isActive ? theme.colors.sidebarActiveText : theme.colors.sidebarTextMuted,
            })}
          >
            New form
          </NavLink>
        </nav>
      </aside>
      <main style={mainStyles}>
        <header style={headerStyles}>
          <span style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.semibold }}>
            {isViewsSection ? 'Views' : 'Form configuration'}
          </span>
          {isViewsSection && (
            <div style={headerTabs}>
              <HeaderTab to="/tasks" label="Tasks" isActive={location.pathname.startsWith('/tasks')} />
            </div>
          )}
        </header>
        <div style={contentStyles}>
          {children}
        </div>
      </main>
    </div>
  );
}
