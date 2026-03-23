import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

const mockForms = [
  { id: '1', name: 'KYB Entity Onboarding', type: 'Internal', status: 'Active', lastModified: '2026-02-28', responses: 124 },
  { id: '2', name: 'Periodic Review Questionnaire', type: 'Internal', status: 'Active', lastModified: '2026-02-26', responses: 89 },
  { id: '3', name: 'Associate Information Request', type: 'External', status: 'Draft', lastModified: '2026-02-25', responses: 0 },
  { id: '4', name: 'UBO Declaration', type: 'Internal', status: 'Active', lastModified: '2026-02-20', responses: 312 },
];

const pageStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: 0,
};

const headerRowStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing.lg,
  flexWrap: 'wrap',
  gap: theme.spacing.md,
};

const titleStyles: React.CSSProperties = {
  fontSize: theme.typography.fontSize.xl,
  fontWeight: theme.typography.fontWeight.semibold,
  color: theme.colors.text,
  margin: 0,
};

const btnPrimary: React.CSSProperties = {
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  background: theme.colors.primary,
  color: '#fff',
  border: 'none',
  borderRadius: theme.radii.md,
  fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.medium,
};

const cardStyles: React.CSSProperties = {
  background: theme.colors.surface,
  borderRadius: theme.radii.lg,
  boxShadow: theme.shadows.md,
  border: `1px solid ${theme.colors.border}`,
  overflow: 'hidden',
};

const tableStyles: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyles: React.CSSProperties = {
  textAlign: 'left',
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontSize: theme.typography.fontSize.xs,
  fontWeight: theme.typography.fontWeight.semibold,
  color: theme.colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  background: theme.colors.surfaceOverlay,
  borderBottom: `1px solid ${theme.colors.border}`,
};

const tdStyles: React.CSSProperties = {
  padding: theme.spacing.md,
  borderBottom: `1px solid ${theme.colors.border}`,
  fontSize: theme.typography.fontSize.sm,
  color: theme.colors.text,
};

const statusBadge = (status: string): React.CSSProperties => ({
  padding: `${2}px ${theme.spacing.sm}`,
  borderRadius: theme.radii.sm,
  fontSize: theme.typography.fontSize.xs,
  fontWeight: theme.typography.fontWeight.medium,
  background: status === 'Active' ? theme.colors.successBg : theme.colors.warningBg,
  color: status === 'Active' ? theme.colors.success : theme.colors.warning,
});

const actionBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: theme.colors.primary,
  fontSize: theme.typography.fontSize.sm,
  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  marginRight: theme.spacing.sm,
};

export function ManageForms() {
  const navigate = useNavigate();

  return (
    <div style={pageStyles}>
      <div style={headerRowStyles}>
        <h1 style={titleStyles}>Manage forms</h1>
        <button style={btnPrimary} onClick={() => navigate('/forms/new')}>
          + New form
        </button>
      </div>

      <div style={cardStyles}>
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>Form name</th>
              <th style={thStyles}>Type</th>
              <th style={thStyles}>Status</th>
              <th style={thStyles}>Last modified</th>
              <th style={thStyles}>Responses</th>
              <th style={{ ...thStyles, width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockForms.map((form) => (
              <tr key={form.id}>
                <td style={tdStyles}>
                  <strong>{form.name}</strong>
                </td>
                <td style={tdStyles}>{form.type}</td>
                <td style={tdStyles}>
                  <span style={statusBadge(form.status)}>{form.status}</span>
                </td>
                <td style={tdStyles}>{form.lastModified}</td>
                <td style={tdStyles}>{form.responses}</td>
                <td style={tdStyles}>
                  <button style={actionBtn} onClick={() => navigate(`/forms/${form.id}`)}>
                    Configure
                  </button>
                  <button style={actionBtn}>Duplicate</button>
                  <button style={{ ...actionBtn, color: theme.colors.textMuted }}>Archive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
