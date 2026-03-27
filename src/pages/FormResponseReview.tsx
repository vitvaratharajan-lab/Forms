import React from 'react';
import { theme } from '../theme';

interface ResponseField {
  id: string;
  fieldLabel: string;
  value: string;
  prefilled: boolean;
  prefilledFrom?: string;
  edited?: boolean;
}

const mockResponseFields: ResponseField[] = [
  { id: 'f1', fieldLabel: 'Entity name', value: 'Acme Corporation Ltd', prefilled: true, prefilledFrom: 'entity.companyName', edited: true },
  { id: 'f2', fieldLabel: 'Registered address', value: '456 Enterprise Way, London EC2R 8AH', prefilled: true, prefilledFrom: 'entity.registeredAddress', edited: true },
  { id: 'f3', fieldLabel: 'Incorporation number', value: '12345678', prefilled: true, prefilledFrom: 'entity.incorporationNumber', edited: false },
  { id: 'f4', fieldLabel: 'Entity type', value: 'Private Limited Company', prefilled: true, prefilledFrom: 'entity.entityType', edited: false },
  { id: 'f5', fieldLabel: 'Has UBOs?', value: 'Yes', prefilled: false },
  { id: 'f6', fieldLabel: 'UBO details', value: 'John Smith — 35% ownership, UK national', prefilled: false },
  { id: 'f7', fieldLabel: 'Analyst justification', value: 'Updated company name to reflect recent rebranding. Address updated per Companies House filing from 2026-02-15.', prefilled: false },
];

const mockTaskMeta = {
  taskId: 'TASK-4821',
  taskType: 'KYB',
  formName: 'KYB Entity Onboarding',
  formVersion: 2,
  entityName: 'Acme Corp',
  entityId: 'ENT-10042',
  assessmentName: 'KYB Onboarding — Acme Corp',
  submittedBy: 'Jane Analyst',
  submittedAt: '2026-03-18 14:32',
  assignedTo: 'David Reviewer',
  status: 'Submitted',
  dedupKey: 'Form: KYB Entity Onboarding · Recipient: Acme Corp',
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
  fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginBottom: '2px',
};

const metaValueStyles: React.CSSProperties = {
  fontSize: theme.typography.fontSize.sm, color: theme.colors.text,
  fontWeight: theme.typography.fontWeight.medium,
};

export function FormResponseReview() {
  const prefilledFields = mockResponseFields.filter((f) => f.prefilled);
  const otherFields = mockResponseFields.filter((f) => !f.prefilled);

  return (
    <div style={pageStyles}>
      <div style={headerRowStyles}>
        <div>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginBottom: '4px' }}>
            Task {mockTaskMeta.taskId} · {mockTaskMeta.taskType}
          </div>
          <h1 style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text, margin: 0 }}>
            {mockTaskMeta.formName}
          </h1>
        </div>
        <span style={{
          padding: `2px ${theme.spacing.sm}`, borderRadius: theme.radii.sm,
          fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium,
          background: theme.colors.successBg, color: theme.colors.success,
        }}>
          {mockTaskMeta.status}
        </span>
      </div>

      {/* Task metadata */}
      <div style={cardStyles}>
        <div style={cardHeaderStyles}>Task details</div>
        <div style={sectionStyles}>
          <div style={metaGridStyles}>
            <div><div style={metaLabelStyles}>Entity</div><div style={metaValueStyles}>{mockTaskMeta.entityName} ({mockTaskMeta.entityId})</div></div>
            <div><div style={metaLabelStyles}>Assessment</div><div style={metaValueStyles}>{mockTaskMeta.assessmentName}</div></div>
            <div><div style={metaLabelStyles}>Task type</div><div style={metaValueStyles}>{mockTaskMeta.taskType}</div></div>
            <div><div style={metaLabelStyles}>Submitted by</div><div style={metaValueStyles}>{mockTaskMeta.submittedBy}</div></div>
            <div><div style={metaLabelStyles}>Submitted at</div><div style={metaValueStyles}>{mockTaskMeta.submittedAt}</div></div>
            <div>
              <div style={metaLabelStyles}>Form version</div>
              <div style={metaValueStyles}>
                v{mockTaskMeta.formVersion}
                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, fontWeight: theme.typography.fontWeight.normal, marginLeft: theme.spacing.xs }}>
                  (locked to version at time of send)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data flow note */}
      <div style={{
        ...cardStyles, background: '#f0f9ff', borderColor: '#bae6fd',
        padding: theme.spacing.md, fontSize: theme.typography.fontSize.xs, color: '#0369a1',
        display: 'flex', alignItems: 'flex-start', gap: theme.spacing.sm,
      }}>
        <span style={{ fontSize: '14px' }}>ℹ</span>
        <span>
          This form response is consumed by the <strong>Assessment Service</strong> as an input to assessment outcomes and risk decisioning.
          Form data does not write back to the Entity Service or custom data.
        </span>
      </div>

      {/* Pre-filled responses */}
      {prefilledFields.length > 0 && (
        <div style={cardStyles}>
          <div style={{ ...cardHeaderStyles, borderLeft: '3px solid #0369a1' }}>
            <span>Pre-filled fields ({prefilledFields.length})</span>
            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, fontWeight: theme.typography.fontWeight.normal }}>
              Data pulled from entity/assessment context
            </span>
          </div>
          <div style={sectionStyles}>
            {prefilledFields.map((field) => (
              <div key={field.id} style={{
                padding: theme.spacing.sm,
                borderBottom: `1px solid ${theme.colors.borderLight}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginBottom: '2px' }}>
                    {field.fieldLabel}
                    {field.prefilledFrom && (
                      <span style={{ marginLeft: theme.spacing.sm, color: '#0369a1' }}>← {field.prefilledFrom}</span>
                    )}
                  </div>
                  <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text }}>
                    {field.value}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: theme.spacing.xs }}>
                  <span style={{
                    fontSize: theme.typography.fontSize.xs, padding: `2px ${theme.spacing.sm}`,
                    background: '#e0f2fe', color: '#0369a1', borderRadius: theme.radii.sm,
                    whiteSpace: 'nowrap',
                  }}>
                    Pre-filled
                  </span>
                  {field.edited && (
                    <span style={{
                      fontSize: theme.typography.fontSize.xs, padding: `2px ${theme.spacing.sm}`,
                      background: theme.colors.warningBg, color: theme.colors.warning,
                      borderRadius: theme.radii.sm, whiteSpace: 'nowrap',
                    }}>
                      Edited
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other responses */}
      {otherFields.length > 0 && (
        <div style={cardStyles}>
          <div style={cardHeaderStyles}>
            <span>Form responses ({otherFields.length})</span>
          </div>
          <div style={sectionStyles}>
            {otherFields.map((field) => (
              <div key={field.id} style={{
                padding: theme.spacing.sm,
                borderBottom: `1px solid ${theme.colors.borderLight}`,
              }}>
                <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginBottom: '2px' }}>
                  {field.fieldLabel}
                </div>
                <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text }}>
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deduplication info */}
      <div style={cardStyles}>
        <div style={cardHeaderStyles}>Deduplication</div>
        <div style={sectionStyles}>
          <div style={{ display: 'flex', gap: theme.spacing.lg }}>
            <div>
              <div style={metaLabelStyles}>Dedup key</div>
              <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text, fontFamily: 'monospace' }}>
                {mockTaskMeta.dedupKey}
              </div>
            </div>
            <div>
              <div style={metaLabelStyles}>Status</div>
              <div style={{
                fontSize: theme.typography.fontSize.xs, padding: `2px ${theme.spacing.sm}`,
                background: theme.colors.successBg, color: theme.colors.success,
                borderRadius: theme.radii.sm, display: 'inline-block',
              }}>
                Active — future requests for this form + recipient will reuse this response
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit trail */}
      <div style={cardStyles}>
        <div style={cardHeaderStyles}>Audit trail</div>
        <div style={sectionStyles}>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textSecondary }}>
            <div style={{ padding: `${theme.spacing.xs} 0`, borderBottom: `1px solid ${theme.colors.borderLight}` }}>
              <strong>2026-03-18 14:32</strong> — {mockTaskMeta.submittedBy} submitted form "{mockTaskMeta.formName}" (v{mockTaskMeta.formVersion}) for entity {mockTaskMeta.entityName}.
            </div>
            <div style={{ padding: `${theme.spacing.xs} 0`, borderBottom: `1px solid ${theme.colors.borderLight}` }}>
              <strong>2026-03-18 14:32</strong> — Form response passed to Assessment Service for "{mockTaskMeta.assessmentName}".
            </div>
            <div style={{ padding: `${theme.spacing.xs} 0`, borderBottom: `1px solid ${theme.colors.borderLight}` }}>
              <strong>2026-03-18 14:30</strong> — Form pre-filled with entity data. 4 fields populated, 0 failed.
            </div>
            <div style={{ padding: `${theme.spacing.xs} 0` }}>
              <strong>2026-03-18 14:28</strong> — Task {mockTaskMeta.taskId} created as part of assessment "{mockTaskMeta.assessmentName}".
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
