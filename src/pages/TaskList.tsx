import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

type TaskStatus = 'Pending Review' | 'In Progress' | 'Completed' | 'Expired';
type TaskType = 'KYB' | 'Risk Review' | 'SC Forms' | 'Screening' | 'Monitoring';

interface TaskItem {
  id: string;
  taskName: string;
  taskType: TaskType;
  entity: string;
  assessment: string;
  status: TaskStatus;
  assignedTo: string;
  created: string;
  hasFormResponse: boolean;
}

const mockTasks: TaskItem[] = [
  {
    id: 'TASK-4821', taskName: 'KYB Entity Onboarding', taskType: 'KYB',
    entity: 'Acme Corp', assessment: 'KYB Onboarding — Acme Corp',
    status: 'Pending Review', assignedTo: 'David Reviewer', created: '2026-03-18',
    hasFormResponse: true,
  },
  {
    id: 'TASK-4819', taskName: 'Periodic Review Questionnaire', taskType: 'KYB',
    entity: 'GlobalTech Solutions', assessment: 'Annual Review — GlobalTech',
    status: 'Pending Review', assignedTo: 'David Reviewer', created: '2026-03-17',
    hasFormResponse: true,
  },
  {
    id: 'TASK-4815', taskName: 'Supplier Due Diligence', taskType: 'KYB',
    entity: 'NorthStar Logistics', assessment: 'Supplier Onboarding — NorthStar',
    status: 'Completed', assignedTo: 'Sarah Analyst', created: '2026-03-15',
    hasFormResponse: true,
  },
  {
    id: 'TASK-4810', taskName: 'KYB Entity Onboarding', taskType: 'SC Forms',
    entity: 'Pacific Trading Co', assessment: 'KYB Onboarding — Pacific Trading',
    status: 'Expired', assignedTo: 'External', created: '2026-03-10',
    hasFormResponse: false,
  },
  {
    id: 'TASK-4808', taskName: 'Sanctions screening', taskType: 'Screening',
    entity: 'Acme Corp', assessment: 'KYB Onboarding — Acme Corp',
    status: 'In Progress', assignedTo: 'Jane Analyst', created: '2026-03-16',
    hasFormResponse: false,
  },
  {
    id: 'TASK-4805', taskName: 'Risk assessment review', taskType: 'Risk Review',
    entity: 'GlobalTech Solutions', assessment: 'Annual Review — GlobalTech',
    status: 'In Progress', assignedTo: 'David Reviewer', created: '2026-03-14',
    hasFormResponse: true,
  },
  {
    id: 'TASK-4803', taskName: 'Transaction monitoring review', taskType: 'Monitoring',
    entity: 'Acme Corp', assessment: 'Ongoing Monitoring — Acme Corp',
    status: 'Pending Review', assignedTo: 'Jane Analyst', created: '2026-03-12',
    hasFormResponse: true,
  },
];

const taskTypes: TaskType[] = ['KYB', 'Risk Review', 'Monitoring', 'SC Forms', 'Screening'];

const pageStyles: React.CSSProperties = { maxWidth: '1200px', margin: 0 };

const headerRowStyles: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  marginBottom: theme.spacing.lg, flexWrap: 'wrap', gap: theme.spacing.md,
};

const titleStyles: React.CSSProperties = {
  fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.semibold,
  color: theme.colors.text, margin: 0,
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

function statusBadge(status: string): React.CSSProperties {
  const colors: Record<string, { bg: string; fg: string }> = {
    'Pending Review': { bg: theme.colors.warningBg, fg: theme.colors.warning },
    'In Progress': { bg: theme.colors.infoBg, fg: theme.colors.info },
    'Completed': { bg: theme.colors.successBg, fg: theme.colors.success },
    'Expired': { bg: theme.colors.errorBg, fg: theme.colors.error },
  };
  const c = colors[status] || { bg: '#f1f3f5', fg: '#6b7280' };
  return {
    padding: `2px ${theme.spacing.sm}`, borderRadius: theme.radii.sm,
    fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium,
    background: c.bg, color: c.fg,
  };
}

const filterBtnStyles = (active: boolean): React.CSSProperties => ({
  padding: `${theme.spacing.xs} ${theme.spacing.md}`,
  background: active ? theme.colors.primaryMuted : 'transparent',
  color: active ? theme.colors.primary : theme.colors.textMuted,
  border: `1px solid ${active ? theme.colors.primary : theme.colors.border}`,
  borderRadius: theme.radii.md, fontSize: theme.typography.fontSize.xs,
  fontWeight: active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
});

const actionBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: theme.colors.primary,
  fontSize: theme.typography.fontSize.xs, padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  marginRight: theme.spacing.xs,
};

export function TaskList() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<TaskType | 'All'>('All');

  const filteredTasks = activeFilter === 'All'
    ? mockTasks
    : mockTasks.filter((t) => t.taskType === activeFilter);

  return (
    <div style={pageStyles}>
      <div style={headerRowStyles}>
        <h1 style={titleStyles}>Tasks</h1>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: theme.spacing.sm, marginBottom: theme.spacing.lg, flexWrap: 'wrap' }}>
        <button style={filterBtnStyles(activeFilter === 'All')} onClick={() => setActiveFilter('All')}>
          All ({mockTasks.length})
        </button>
        {taskTypes.map((tt) => {
          const count = mockTasks.filter((t) => t.taskType === tt).length;
          if (count === 0) return null;
          return (
            <button key={tt} style={filterBtnStyles(activeFilter === tt)} onClick={() => setActiveFilter(tt)}>
              {tt} ({count})
            </button>
          );
        })}
      </div>

      <div style={cardStyles}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyles}>Task</th>
              <th style={thStyles}>Task type</th>
              <th style={thStyles}>Entity</th>
              <th style={thStyles}>Assessment</th>
              <th style={thStyles}>Status</th>
              <th style={thStyles}>Assigned to</th>
              <th style={thStyles}>Created</th>
              <th style={{ ...thStyles, width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} style={{ background: 'transparent' }}>
                <td style={tdStyles}>
                  <div>
                    <button
                      style={{
                        ...actionBtn,
                        fontWeight: theme.typography.fontWeight.semibold,
                        fontSize: theme.typography.fontSize.sm,
                        padding: 0,
                      }}
                      onClick={() => {
                        if (task.hasFormResponse) navigate('/tasks/review');
                      }}
                    >
                      {task.taskName}
                    </button>
                  </div>
                  <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted }}>
                    {task.id}
                  </div>
                </td>
                <td style={tdStyles}>
                  <span style={{
                    padding: `2px ${theme.spacing.sm}`,
                    background: '#f1f3f5',
                    color: theme.colors.textMuted,
                    borderRadius: theme.radii.sm, fontSize: theme.typography.fontSize.xs,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}>
                    {task.taskType}
                  </span>
                </td>
                <td style={tdStyles}>{task.entity}</td>
                <td style={{ ...tdStyles, fontSize: theme.typography.fontSize.xs }}>{task.assessment}</td>
                <td style={tdStyles}><span style={statusBadge(task.status)}>{task.status}</span></td>
                <td style={tdStyles}>{task.assignedTo}</td>
                <td style={tdStyles}>{task.created}</td>
                <td style={tdStyles}>
                  {task.hasFormResponse && task.status === 'Pending Review' && (
                    <button style={actionBtn} onClick={() => navigate('/tasks/review')}>Review</button>
                  )}
                  {task.status === 'Expired' && (
                    <>
                      <button style={actionBtn}>Resend</button>
                      <button style={actionBtn}>Fill on behalf</button>
                    </>
                  )}
                  {task.status === 'Completed' && (
                    <button style={actionBtn} onClick={() => navigate('/tasks/review')}>View</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
