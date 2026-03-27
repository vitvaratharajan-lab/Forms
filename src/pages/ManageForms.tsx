import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

type FormStatus = 'Published' | 'Draft';
type Channel = 'Internal' | 'External';

interface FormEntry {
  id: string;
  name: string;
  channel: Channel;
  version: number;
  status: FormStatus;
  hasDraft: boolean;
  dedupEnabled: boolean;
  lastModified: string;
  responses: number;
}

const mockForms: FormEntry[] = [
  {
    id: '1', name: 'KYB Entity Onboarding', channel: 'Internal',
    version: 2, status: 'Published', hasDraft: true, dedupEnabled: true,
    lastModified: '2026-03-18', responses: 124,
  },
  {
    id: '2', name: 'Periodic Review Questionnaire', channel: 'Internal',
    version: 3, status: 'Published', hasDraft: false, dedupEnabled: true,
    lastModified: '2026-03-10', responses: 89,
  },
  {
    id: '3', name: 'Associate Information Request', channel: 'External',
    version: 0, status: 'Draft', hasDraft: true, dedupEnabled: false,
    lastModified: '2026-03-15', responses: 0,
  },
  {
    id: '4', name: 'UBO Declaration', channel: 'Internal',
    version: 1, status: 'Published', hasDraft: false, dedupEnabled: false,
    lastModified: '2026-02-20', responses: 312,
  },
  {
    id: '5', name: 'Supplier Due Diligence Questionnaire', channel: 'External',
    version: 1, status: 'Published', hasDraft: false, dedupEnabled: true,
    lastModified: '2026-03-05', responses: 47,
  },
];

const pageStyles: React.CSSProperties = { maxWidth: '1200px', margin: 0 };

const headerRowStyles: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  marginBottom: theme.spacing.lg, flexWrap: 'wrap', gap: theme.spacing.md,
};

const titleStyles: React.CSSProperties = {
  fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.semibold,
  color: theme.colors.text, margin: 0,
};

const btnPrimary: React.CSSProperties = {
  padding: `${theme.spacing.sm} ${theme.spacing.md}`, background: theme.colors.primary,
  color: '#fff', border: 'none', borderRadius: theme.radii.md,
  fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium,
  cursor: 'pointer',
};

const cardStyles: React.CSSProperties = {
  background: theme.colors.surface, borderRadius: theme.radii.lg,
  boxShadow: theme.shadows.md, border: `1px solid ${theme.colors.border}`,
  overflow: 'hidden',
};

const thStyles: React.CSSProperties = {
  textAlign: 'left', padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.semibold,
  color: theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em',
  background: theme.colors.surfaceOverlay, borderBottom: `1px solid ${theme.colors.border}`,
};

const tdStyles: React.CSSProperties = {
  padding: theme.spacing.md, borderBottom: `1px solid ${theme.colors.border}`,
  fontSize: theme.typography.fontSize.sm, color: theme.colors.text,
};

const actionBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: theme.colors.primary,
  fontSize: theme.typography.fontSize.sm, padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  marginRight: theme.spacing.sm, cursor: 'pointer',
};

export function ManageForms() {
  const navigate = useNavigate();

  return (
    <div style={pageStyles}>
      <div style={headerRowStyles}>
        <h1 style={titleStyles}>Manage forms</h1>
        <button style={btnPrimary} onClick={() => navigate('/forms/new')}>+ New form</button>
      </div>

      <div style={cardStyles}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyles}>Form name</th>
              <th style={thStyles}>Channel</th>
              <th style={thStyles}>Version</th>
              <th style={thStyles}>Status</th>
              <th style={thStyles}>Dedup</th>
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
                <td style={tdStyles}>
                  <span style={{
                    padding: `2px ${theme.spacing.sm}`, borderRadius: theme.radii.sm,
                    fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium,
                    background: form.channel === 'External' ? '#f3e8ff' : '#f1f3f5',
                    color: form.channel === 'External' ? '#7c3aed' : theme.colors.textMuted,
                  }}>
                    {form.channel}
                  </span>
                </td>
                <td style={tdStyles}>
                  <span style={{ fontWeight: theme.typography.fontWeight.semibold }}>
                    {form.version > 0 ? `v${form.version}` : '—'}
                  </span>
                  {form.hasDraft && form.version > 0 && (
                    <span style={{
                      marginLeft: theme.spacing.xs, fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.warning,
                    }}>
                      + draft
                    </span>
                  )}
                </td>
                <td style={tdStyles}>
                  <span style={{
                    padding: `2px ${theme.spacing.sm}`, borderRadius: theme.radii.sm,
                    fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium,
                    background: form.status === 'Published' ? theme.colors.successBg : theme.colors.warningBg,
                    color: form.status === 'Published' ? theme.colors.success : theme.colors.warning,
                  }}>
                    {form.status}
                  </span>
                </td>
                <td style={tdStyles}>
                  <span style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: form.dedupEnabled ? theme.colors.success : theme.colors.textMuted,
                  }}>
                    {form.dedupEnabled ? 'Enabled' : 'Off'}
                  </span>
                </td>
                <td style={tdStyles}>{form.lastModified}</td>
                <td style={tdStyles}>{form.responses}</td>
                <td style={tdStyles}>
                  <button style={actionBtn} onClick={() => navigate(`/forms/${form.id}`)}>Configure</button>
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
