import React, { useState } from 'react';
import { theme } from '../theme';

type OverrideStatus = 'pending' | 'approved' | 'rejected';
type DataLane = 'entity_override' | 'custom_data' | 'form_local';

interface ReviewField {
  id: string;
  fieldLabel: string;
  dataLane: DataLane;
  originalValue: string;
  originalSource: string;
  newValue: string;
  status: OverrideStatus;
}

interface FormLocalField {
  id: string;
  fieldLabel: string;
  value: string;
}

const mockEntityOverrides: ReviewField[] = [
  {
    id: 'r1', fieldLabel: 'Company name', dataLane: 'entity_override',
    originalValue: 'Acme Corp', originalSource: 'Registry',
    newValue: 'Acme Corporation Ltd', status: 'pending',
  },
  {
    id: 'r2', fieldLabel: 'Registered address', dataLane: 'entity_override',
    originalValue: '123 Business Park, London EC1A 1BB', originalSource: 'Registry',
    newValue: '456 Enterprise Way, London EC2R 8AH', status: 'pending',
  },
];

const mockCustomDataChanges: ReviewField[] = [
  {
    id: 'r3', fieldLabel: 'Supplier tier', dataLane: 'custom_data',
    originalValue: 'Tier 2', originalSource: 'Custom Data',
    newValue: 'Tier 1 - Strategic', status: 'pending',
  },
  {
    id: 'r4', fieldLabel: 'Internal risk rating', dataLane: 'custom_data',
    originalValue: '—', originalSource: 'Custom Data (new field)',
    newValue: 'Medium', status: 'pending',
  },
];

const mockFormLocalFields: FormLocalField[] = [
  { id: 'fl1', fieldLabel: 'Has UBOs?', value: 'Yes' },
  { id: 'fl2', fieldLabel: 'UBO details', value: 'John Smith — 35% ownership, UK national' },
  { id: 'fl3', fieldLabel: 'Analyst justification', value: 'Updated company name to reflect recent rebranding. Address updated per Companies House filing from 2026-02-15.' },
];

const mockTaskMeta = {
  taskId: 'TASK-4821',
  formName: 'KYB Entity Onboarding',
  entityName: 'Acme Corp',
  entityId: 'ENT-10042',
  assessmentName: 'KYB Onboarding — Acme Corp',
  submittedBy: 'Jane Analyst',
  submittedAt: '2026-03-18 14:32',
  assignedTo: 'David Reviewer',
  status: 'Pending Review',
};

const pageStyles: React.CSSProperties = { maxWidth: '1000px', margin: 0 };

const headerRowStyles: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  marginBottom: theme.spacing.lg, flexWrap: 'wrap', gap: theme.spacing.md,
};

const cardStyles: React.CSSProperties = {
  background: theme.colors.surface, borderRadius: theme.radii.lg,
  boxShadow: theme.shadows.md, border: `1px solid ${theme.colors.border}`,
  overflow: 'hidden', marginBottom: theme.spacing.lg,
};

const cardHeaderStyles: React.CSSProperties = {
  padding: theme.spacing.md, background: theme.colors.surfaceOverlay,
  borderBottom: `1px solid ${theme.colors.border}`, fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text,
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
};

const sectionStyles: React.CSSProperties = { padding: theme.spacing.lg };

const metaGridStyles: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: theme.spacing.md,
};

const metaLabelStyles: React.CSSProperties = {
  fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted,
  marginBottom: '2px',
};

const metaValueStyles: React.CSSProperties = {
  fontSize: theme.typography.fontSize.sm, color: theme.colors.text,
  fontWeight: theme.typography.fontWeight.medium,
};

const btnPrimary: React.CSSProperties = {
  padding: `${theme.spacing.sm} ${theme.spacing.md}`, background: theme.colors.primary,
  color: '#fff', border: 'none', borderRadius: theme.radii.md,
  fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium,
};

const btnSecondary: React.CSSProperties = {
  padding: `${theme.spacing.sm} ${theme.spacing.md}`, background: theme.colors.surface,
  color: theme.colors.primary, border: `1px solid ${theme.colors.borderStrong}`,
  borderRadius: theme.radii.md, fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.medium,
};

function StatusBadge({ status }: { status: OverrideStatus | string }) {
  const styles: Record<string, { bg: string; fg: string }> = {
    pending: { bg: theme.colors.warningBg, fg: theme.colors.warning },
    approved: { bg: theme.colors.successBg, fg: theme.colors.success },
    rejected: { bg: theme.colors.errorBg, fg: theme.colors.error },
    'Pending Review': { bg: theme.colors.warningBg, fg: theme.colors.warning },
  };
  const c = styles[status] || styles.pending;
  return (
    <span style={{
      display: 'inline-block', padding: `2px ${theme.spacing.sm}`,
      background: c.bg, color: c.fg, borderRadius: theme.radii.sm,
      fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium,
    }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function OverrideReviewCard({
  field, onApprove, onReject,
}: {
  field: ReviewField;
  onApprove: () => void;
  onReject: () => void;
}) {
  const laneColor = field.dataLane === 'entity_override' ? '#0369a1' : '#7c3aed';
  const laneBg = field.dataLane === 'entity_override' ? '#e0f2fe' : '#f3e8ff';
  const laneLabel = field.dataLane === 'entity_override' ? 'Entity Override' : 'Custom Data';

  return (
    <div style={{
      padding: theme.spacing.md,
      border: `1px solid ${field.status === 'pending' ? theme.colors.borderStrong : theme.colors.border}`,
      borderLeft: `3px solid ${laneColor}`,
      borderRadius: theme.radii.md, marginBottom: theme.spacing.sm,
      background: field.status === 'approved' ? '#f0fdf4'
        : field.status === 'rejected' ? '#fef2f2' : theme.colors.surface,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <span style={{
            display: 'inline-block', padding: `2px ${theme.spacing.sm}`,
            background: laneBg, color: laneColor, borderRadius: theme.radii.sm,
            fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium,
          }}>
            {laneLabel}
          </span>
          <strong style={{ fontSize: theme.typography.fontSize.sm }}>{field.fieldLabel}</strong>
        </div>
        <StatusBadge status={field.status} />
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 32px 1fr', gap: theme.spacing.sm,
        alignItems: 'center', marginBottom: theme.spacing.sm,
      }}>
        <div style={{
          padding: theme.spacing.sm, background: theme.colors.surfaceRaised,
          borderRadius: theme.radii.sm, border: `1px solid ${theme.colors.border}`,
        }}>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginBottom: '2px' }}>
            Current value ({field.originalSource})
          </div>
          <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text }}>
            {field.originalValue || <span style={{ color: theme.colors.textMuted, fontStyle: 'italic' }}>Empty</span>}
          </div>
        </div>
        <div style={{ textAlign: 'center', color: theme.colors.textMuted, fontSize: '16px' }}>→</div>
        <div style={{
          padding: theme.spacing.sm, background: '#fffbeb',
          borderRadius: theme.radii.sm, border: '1px solid #fde68a',
        }}>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginBottom: '2px' }}>
            Proposed value (form response)
          </div>
          <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text, fontWeight: theme.typography.fontWeight.medium }}>
            {field.newValue}
          </div>
        </div>
      </div>

      {field.status === 'pending' && (
        <div style={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end' }}>
          <button onClick={onReject} style={{
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            background: theme.colors.surface, color: theme.colors.error,
            border: `1px solid ${theme.colors.error}`, borderRadius: theme.radii.sm,
            fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium,
          }}>
            Reject
          </button>
          <button onClick={onApprove} style={{
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            background: theme.colors.success, color: '#fff',
            border: 'none', borderRadius: theme.radii.sm,
            fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium,
          }}>
            Approve override
          </button>
        </div>
      )}
    </div>
  );
}

export function FormResponseReview() {
  const [entityFields, setEntityFields] = useState(mockEntityOverrides);
  const [customFields, setCustomFields] = useState(mockCustomDataChanges);

  const updateFieldStatus = (
    list: ReviewField[],
    setList: React.Dispatch<React.SetStateAction<ReviewField[]>>,
    fieldId: string,
    status: OverrideStatus,
  ) => {
    setList(list.map((f) => (f.id === fieldId ? { ...f, status } : f)));
  };

  const allFields = [...entityFields, ...customFields];
  const pendingCount = allFields.filter((f) => f.status === 'pending').length;
  const approvedCount = allFields.filter((f) => f.status === 'approved').length;
  const rejectedCount = allFields.filter((f) => f.status === 'rejected').length;

  const approveAll = () => {
    setEntityFields((prev) => prev.map((f) => f.status === 'pending' ? { ...f, status: 'approved' as OverrideStatus } : f));
    setCustomFields((prev) => prev.map((f) => f.status === 'pending' ? { ...f, status: 'approved' as OverrideStatus } : f));
  };

  return (
    <div style={pageStyles}>
      <div style={headerRowStyles}>
        <div>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginBottom: '4px' }}>
            Task {mockTaskMeta.taskId} · Form response review
          </div>
          <h1 style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text, margin: 0 }}>
            Review: {mockTaskMeta.formName}
          </h1>
        </div>
        <StatusBadge status={mockTaskMeta.status} />
      </div>

      {/* Task metadata */}
      <div style={cardStyles}>
        <div style={cardHeaderStyles}>Task details</div>
        <div style={sectionStyles}>
          <div style={metaGridStyles}>
            <div><div style={metaLabelStyles}>Entity</div><div style={metaValueStyles}>{mockTaskMeta.entityName} ({mockTaskMeta.entityId})</div></div>
            <div><div style={metaLabelStyles}>Assessment</div><div style={metaValueStyles}>{mockTaskMeta.assessmentName}</div></div>
            <div><div style={metaLabelStyles}>Submitted by</div><div style={metaValueStyles}>{mockTaskMeta.submittedBy}</div></div>
            <div><div style={metaLabelStyles}>Submitted at</div><div style={metaValueStyles}>{mockTaskMeta.submittedAt}</div></div>
            <div><div style={metaLabelStyles}>Assigned to</div><div style={metaValueStyles}>{mockTaskMeta.assignedTo}</div></div>
            <div><div style={metaLabelStyles}>Form name</div><div style={metaValueStyles}>{mockTaskMeta.formName}</div></div>
          </div>
        </div>
      </div>

      {/* Review summary bar */}
      <div style={{
        ...cardStyles,
        background: pendingCount === 0 ? '#f0fdf4' : theme.colors.surface,
      }}>
        <div style={{
          padding: theme.spacing.md, display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: theme.spacing.sm,
        }}>
          <div style={{ display: 'flex', gap: theme.spacing.lg }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.warning }}>{pendingCount}</div>
              <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted }}>Pending</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.success }}>{approvedCount}</div>
              <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted }}>Approved</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.error }}>{rejectedCount}</div>
              <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted }}>Rejected</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: theme.spacing.sm }}>
            {pendingCount > 0 && (
              <button onClick={approveAll} style={btnPrimary}>Approve all pending ({pendingCount})</button>
            )}
            {pendingCount === 0 && (
              <button style={btnPrimary}>Complete review</button>
            )}
          </div>
        </div>
      </div>

      {/* Entity overrides */}
      <div style={cardStyles}>
        <div style={{ ...cardHeaderStyles, borderLeft: '3px solid #0369a1' }}>
          <span>Entity data overrides ({entityFields.length})</span>
          <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, fontWeight: theme.typography.fontWeight.normal }}>
            Approved changes will be written to the Entity Service and propagated across Maxsight
          </span>
        </div>
        <div style={sectionStyles}>
          {entityFields.map((field) => (
            <OverrideReviewCard
              key={field.id}
              field={field}
              onApprove={() => updateFieldStatus(entityFields, setEntityFields, field.id, 'approved')}
              onReject={() => updateFieldStatus(entityFields, setEntityFields, field.id, 'rejected')}
            />
          ))}
        </div>
      </div>

      {/* Custom data changes */}
      <div style={cardStyles}>
        <div style={{ ...cardHeaderStyles, borderLeft: '3px solid #7c3aed' }}>
          <span>Custom data changes ({customFields.length})</span>
          <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, fontWeight: theme.typography.fontWeight.normal }}>
            Approved changes will be written to the Custom Data Service
          </span>
        </div>
        <div style={sectionStyles}>
          {customFields.map((field) => (
            <OverrideReviewCard
              key={field.id}
              field={field}
              onApprove={() => updateFieldStatus(customFields, setCustomFields, field.id, 'approved')}
              onReject={() => updateFieldStatus(customFields, setCustomFields, field.id, 'rejected')}
            />
          ))}
        </div>
      </div>

      {/* Form-local data (read-only) */}
      <div style={cardStyles}>
        <div style={{ ...cardHeaderStyles, borderLeft: '3px solid #d1d5db' }}>
          <span>Form-local data (no review needed)</span>
          <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, fontWeight: theme.typography.fontWeight.normal }}>
            Assessment-scoped data — stored in form response only
          </span>
        </div>
        <div style={sectionStyles}>
          {mockFormLocalFields.map((field) => (
            <div key={field.id} style={{
              padding: theme.spacing.sm,
              borderBottom: `1px solid ${theme.colors.borderLight}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginBottom: '2px' }}>
                  {field.fieldLabel}
                </div>
                <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text }}>
                  {field.value}
                </div>
              </div>
              <span style={{
                fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted,
                padding: `2px ${theme.spacing.sm}`, background: '#f1f3f5',
                borderRadius: theme.radii.sm, whiteSpace: 'nowrap',
              }}>
                Form-local
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Audit trail */}
      <div style={cardStyles}>
        <div style={cardHeaderStyles}>Audit trail</div>
        <div style={sectionStyles}>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textSecondary }}>
            <div style={{ padding: `${theme.spacing.xs} 0`, borderBottom: `1px solid ${theme.colors.borderLight}` }}>
              <strong>2026-03-18 14:32</strong> — {mockTaskMeta.submittedBy} submitted form "{mockTaskMeta.formName}" for entity {mockTaskMeta.entityName}. 2 entity overrides and 2 custom data changes flagged for review.
            </div>
            <div style={{ padding: `${theme.spacing.xs} 0`, borderBottom: `1px solid ${theme.colors.borderLight}` }}>
              <strong>2026-03-18 14:32</strong> — Review task {mockTaskMeta.taskId} created and assigned to {mockTaskMeta.assignedTo}.
            </div>
            <div style={{ padding: `${theme.spacing.xs} 0`, color: theme.colors.textMuted, fontStyle: 'italic' }}>
              Awaiting reviewer actions...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
