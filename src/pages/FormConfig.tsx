import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../theme';

type PrefillBehaviour = 'read_only' | 'prefill_and_allow_edit' | 'no_prefill';
type Channel = 'Internal' | 'External';
type DedupTimeWindow = 'time_bound' | 'forever';

interface FormQuestion {
  id: string;
  type: string;
  title: string;
  name: string;
  isRequired?: boolean;
  visibleIf?: string;
  helpText?: string;
  prefillBehaviour?: PrefillBehaviour;
  mappedField?: string;
}

interface ValidationCheck {
  label: string;
  severity: 'error' | 'warning';
  passed: boolean;
}

const mockQuestions: FormQuestion[] = [
  {
    id: 'q1', type: 'text', title: 'Entity name', name: 'entityName', isRequired: true,
    prefillBehaviour: 'prefill_and_allow_edit', mappedField: 'entity.companyName',
  },
  {
    id: 'q2', type: 'text', title: 'Registered address', name: 'registeredAddress', isRequired: true,
    prefillBehaviour: 'prefill_and_allow_edit', mappedField: 'entity.registeredAddress',
  },
  {
    id: 'q3', type: 'text', title: 'Incorporation number', name: 'incorporationNumber',
    prefillBehaviour: 'read_only', mappedField: 'entity.incorporationNumber',
  },
  {
    id: 'q4', type: 'dropdown', title: 'Entity type', name: 'entityType', isRequired: true,
    prefillBehaviour: 'prefill_and_allow_edit', mappedField: 'entity.entityType',
  },
  {
    id: 'q5', type: 'boolean', title: 'Has UBOs?', name: 'hasUbo',
  },
  {
    id: 'q6', type: 'panel', title: 'UBO details', name: 'uboDetails', visibleIf: '{hasUbo} = true',
  },
  {
    id: 'q7', type: 'textarea', title: 'Analyst justification', name: 'analystNotes',
    helpText: 'Provide context for any decisions made during this review.',
  },
];

const entityFields = [
  'entity.companyName', 'entity.registeredAddress', 'entity.incorporationNumber',
  'entity.entityType', 'entity.countryOfIncorporation', 'entity.legalForm',
  'entity.dateOfIncorporation', 'entity.tradingNames', 'entity.status',
];

const pageStyles: React.CSSProperties = { maxWidth: '1000px', margin: 0 };

const headerRowStyles: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  marginBottom: theme.spacing.lg, flexWrap: 'wrap', gap: theme.spacing.md,
};

const titleStyles: React.CSSProperties = {
  fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.semibold,
  color: theme.colors.text, margin: 0,
};

const btnSecondary: React.CSSProperties = {
  padding: `${theme.spacing.sm} ${theme.spacing.md}`, background: theme.colors.surface,
  color: theme.colors.primary, border: `1px solid ${theme.colors.borderStrong}`,
  borderRadius: theme.radii.md, fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.medium, cursor: 'pointer',
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
  overflow: 'hidden', marginBottom: theme.spacing.lg,
};

const cardHeaderStyles: React.CSSProperties = {
  padding: theme.spacing.md, background: theme.colors.surfaceOverlay,
  borderBottom: `1px solid ${theme.colors.border}`, fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text,
};

const sectionStyles: React.CSSProperties = { padding: theme.spacing.lg };

const formRowStyles: React.CSSProperties = { marginBottom: theme.spacing.md };

const labelStyles: React.CSSProperties = {
  display: 'block', marginBottom: theme.spacing.xs, fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.medium, color: theme.colors.textSecondary,
};

const inputStyles: React.CSSProperties = {
  width: '100%', maxWidth: '400px', padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.md,
  fontSize: theme.typography.fontSize.sm,
};

const selectStyles: React.CSSProperties = {
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.md,
  fontSize: theme.typography.fontSize.sm, background: '#fff',
};

const questionCardStyles: React.CSSProperties = {
  padding: theme.spacing.md, border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.md, marginBottom: theme.spacing.sm,
  background: theme.colors.surfaceRaised,
};

const questionTypeBadge: React.CSSProperties = {
  display: 'inline-block', padding: `2px ${theme.spacing.sm}`,
  background: theme.colors.primaryMuted, color: theme.colors.primary,
  borderRadius: theme.radii.sm, fontSize: theme.typography.fontSize.xs,
  marginRight: theme.spacing.sm,
};

const modalOverlayStyles: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.4)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};

const modalStyles: React.CSSProperties = {
  background: theme.colors.surface, borderRadius: theme.radii.lg,
  boxShadow: theme.shadows.lg, width: '560px', maxHeight: '80vh',
  overflow: 'auto',
};

const prefillLabels: Record<PrefillBehaviour, string> = {
  read_only: 'Read-only',
  prefill_and_allow_edit: 'Pre-fill & allow edit',
  no_prefill: 'No pre-fill',
};

const prefillColors: Record<PrefillBehaviour, { bg: string; fg: string }> = {
  read_only: { bg: '#f1f3f5', fg: '#6b7280' },
  prefill_and_allow_edit: { bg: '#dcfce7', fg: '#166534' },
  no_prefill: { bg: '#fef3c7', fg: '#b45309' },
};

function QuestionCard({ question }: { question: FormQuestion }) {
  const hasPrefill = question.prefillBehaviour && question.prefillBehaviour !== 'no_prefill' && question.mappedField;

  return (
    <div style={{
      ...questionCardStyles,
      borderLeft: hasPrefill ? '3px solid #0369a1' : `3px solid ${theme.colors.border}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <div>
          <span style={questionTypeBadge}>{question.type}</span>
          {question.prefillBehaviour && (
            <span style={{
              display: 'inline-block', padding: `2px ${theme.spacing.sm}`,
              background: prefillColors[question.prefillBehaviour].bg,
              color: prefillColors[question.prefillBehaviour].fg,
              borderRadius: theme.radii.sm, fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium, marginRight: theme.spacing.sm,
            }}>
              {prefillLabels[question.prefillBehaviour]}
            </span>
          )}
          <strong style={{ fontSize: theme.typography.fontSize.sm }}>{question.title}</strong>
          {question.isRequired && (
            <span style={{ marginLeft: theme.spacing.sm, color: theme.colors.error, fontSize: theme.typography.fontSize.xs }}>Required</span>
          )}
        </div>
      </div>

      {hasPrefill && (
        <div style={{
          marginTop: theme.spacing.sm, padding: theme.spacing.sm,
          background: '#f0f9ff', borderRadius: theme.radii.sm, fontSize: theme.typography.fontSize.xs,
        }}>
          <span style={{ color: theme.colors.textMuted }}>Pre-fill from: </span>
          <span style={{ fontWeight: theme.typography.fontWeight.medium }}>{question.mappedField}</span>
          {question.prefillBehaviour === 'read_only' && (
            <span style={{ marginLeft: theme.spacing.sm, color: '#6b7280' }}>
              — displayed for context only, not editable
            </span>
          )}
          {question.prefillBehaviour === 'prefill_and_allow_edit' && (
            <span style={{ marginLeft: theme.spacing.sm, color: '#166534' }}>
              — recipient can edit the pre-filled value
            </span>
          )}
        </div>
      )}

      {question.visibleIf && (
        <div style={{ marginTop: theme.spacing.xs, fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted }}>
          Visible when: {question.visibleIf}
        </div>
      )}

      {question.helpText && (
        <div style={{ marginTop: theme.spacing.xs, fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, fontStyle: 'italic' }}>
          Help text: {question.helpText}
        </div>
      )}
    </div>
  );
}

function PublishValidationModal({ onClose, onPublish }: { onClose: () => void; onPublish: () => void }) {
  const publishChecks: ValidationCheck[] = [
    { label: 'At least one section exists', severity: 'error', passed: true },
    { label: 'At least one question is defined', severity: 'error', passed: true },
    { label: 'All questions have a field type assigned', severity: 'error', passed: true },
    { label: 'All field names are unique', severity: 'error', passed: true },
    { label: 'Branching rules reference valid questions and answer values', severity: 'error', passed: true },
    { label: 'No orphaned or unreachable sections', severity: 'error', passed: true },
    { label: 'Sections with no questions', severity: 'warning', passed: false },
  ];

  const runtimeChecks: ValidationCheck[] = [
    { label: 'Pre-fill mappings are type-consistent with available entity data', severity: 'warning', passed: true },
  ];

  const hasErrors = publishChecks.some((c) => c.severity === 'error' && !c.passed);

  return (
    <div style={modalOverlayStyles} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...cardHeaderStyles, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Publish validation</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: theme.colors.textMuted }}>×</button>
        </div>
        <div style={sectionStyles}>
          <div style={{ marginBottom: theme.spacing.lg }}>
            <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, marginBottom: theme.spacing.sm }}>
              Publish-time checks (form structure)
            </div>
            <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginBottom: theme.spacing.md }}>
              These checks run when publishing. Errors block publish.
            </div>
            {publishChecks.map((check, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: theme.spacing.sm,
                padding: `${theme.spacing.xs} 0`,
                borderBottom: i < publishChecks.length - 1 ? `1px solid ${theme.colors.borderLight}` : 'none',
              }}>
                <span style={{
                  fontSize: '14px', width: '20px', textAlign: 'center',
                  color: check.passed ? theme.colors.success : (check.severity === 'error' ? theme.colors.error : theme.colors.warning),
                }}>
                  {check.passed ? '✓' : (check.severity === 'error' ? '✗' : '⚠')}
                </span>
                <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text }}>{check.label}</span>
                <span style={{
                  marginLeft: 'auto', fontSize: theme.typography.fontSize.xs,
                  padding: `1px ${theme.spacing.xs}`, borderRadius: theme.radii.sm,
                  background: check.severity === 'error' ? theme.colors.errorBg : theme.colors.warningBg,
                  color: check.severity === 'error' ? theme.colors.error : theme.colors.warning,
                }}>
                  {check.severity}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: theme.spacing.lg }}>
            <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, marginBottom: theme.spacing.sm }}>
              Runtime checks (validated when workflow triggers the form)
            </div>
            <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginBottom: theme.spacing.md }}>
              These are not checked at publish time — the form doesn't know which workflow it will be used in. If pre-fill fails at runtime, the field is left empty (never blocks the form).
            </div>
            {runtimeChecks.map((check, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: theme.spacing.sm,
                padding: `${theme.spacing.xs} 0`, color: theme.colors.textMuted,
              }}>
                <span style={{ fontSize: '14px', width: '20px', textAlign: 'center' }}>ℹ</span>
                <span style={{ fontSize: theme.typography.fontSize.sm }}>{check.label}</span>
                <span style={{
                  marginLeft: 'auto', fontSize: theme.typography.fontSize.xs,
                  padding: `1px ${theme.spacing.xs}`, borderRadius: theme.radii.sm,
                  background: '#f1f3f5', color: theme.colors.textMuted,
                }}>
                  runtime
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm }}>
            <button style={btnSecondary} onClick={onClose}>Cancel</button>
            <button
              style={{ ...btnPrimary, opacity: hasErrors ? 0.5 : 1 }}
              disabled={hasErrors}
              onClick={onPublish}
            >
              {hasErrors ? 'Fix errors to publish' : 'Publish as new version'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormConfig() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const isNew = formId === undefined || formId === 'new';

  const [formName, setFormName] = useState(isNew ? '' : 'KYB Entity Onboarding');
  const [formDescription, setFormDescription] = useState(isNew ? '' : 'Collect entity details for KYB onboarding assessments.');
  const [channel, setChannel] = useState<Channel>(isNew ? 'Internal' : 'Internal');
  const [dedupEnabled, setDedupEnabled] = useState(!isNew);
  const [dedupWindow, setDedupWindow] = useState<DedupTimeWindow>('time_bound');
  const [dedupDays, setDedupDays] = useState('365');
  const [showValidation, setShowValidation] = useState(false);
  const [currentVersion] = useState(isNew ? null : 2);
  const [isDraft] = useState(true);
  const [publishedVersion] = useState(isNew ? null : 2);

  const questions = mockQuestions;

  const prefillQuestions = questions.filter((q) => q.prefillBehaviour && q.prefillBehaviour !== 'no_prefill');
  const otherQuestions = questions.filter((q) => !q.prefillBehaviour || q.prefillBehaviour === 'no_prefill');

  return (
    <div style={pageStyles}>
      {/* Header with version indicator */}
      <div style={headerRowStyles}>
        <div>
          <h1 style={titleStyles}>{isNew ? 'New form' : 'Configure form'}</h1>
          {!isNew && (
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginTop: theme.spacing.xs }}>
              <span style={{
                padding: `2px ${theme.spacing.sm}`, borderRadius: theme.radii.sm,
                fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.semibold,
                background: isDraft ? theme.colors.warningBg : theme.colors.successBg,
                color: isDraft ? theme.colors.warning : theme.colors.success,
              }}>
                {isDraft ? `v${(currentVersion || 0) + 1} Draft` : `v${currentVersion} Published`}
              </span>
              {publishedVersion && isDraft && (
                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted }}>
                  v{publishedVersion} is currently live — this draft will become v{publishedVersion + 1} when published
                </span>
              )}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <button style={btnSecondary} onClick={() => navigate('/forms')}>Cancel</button>
          <button style={btnSecondary}>Save draft</button>
          <button style={btnPrimary} onClick={() => setShowValidation(true)}>Publish</button>
        </div>
      </div>

      {/* Version banner */}
      {!isNew && isDraft && (
        <div style={{
          ...cardStyles, background: '#fffbeb', borderColor: '#fde68a',
          marginBottom: theme.spacing.lg, padding: theme.spacing.md,
          fontSize: theme.typography.fontSize.sm, color: '#92400e',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>You are editing a draft. The published version (v{publishedVersion}) continues serving workflows and in-flight forms until you publish this draft.</span>
        </div>
      )}

      {/* Form details */}
      <div style={cardStyles}>
        <div style={cardHeaderStyles}>Form details</div>
        <div style={sectionStyles}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
            <div style={formRowStyles}>
              <label style={labelStyles}>Form name</label>
              <input type="text" style={inputStyles} value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. KYB Entity Onboarding" />
            </div>
            <div style={formRowStyles}>
              <label style={labelStyles}>Channel</label>
              <select style={{ ...selectStyles, width: '100%', maxWidth: '400px' }} value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
                <option value="Internal">Internal (platform UI)</option>
                <option value="External">External (email)</option>
              </select>
            </div>
          </div>
          <div style={formRowStyles}>
            <label style={labelStyles}>Description</label>
            <input type="text" style={{ ...inputStyles, maxWidth: '100%' }} value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Brief description of the form" />
          </div>
        </div>
      </div>

      {/* Questions — pre-filled fields */}
      {prefillQuestions.length > 0 && (
        <div style={cardStyles}>
          <div style={{ ...cardHeaderStyles, borderLeft: '3px solid #0369a1' }}>
            Pre-filled fields ({prefillQuestions.length})
            <span style={{ fontWeight: theme.typography.fontWeight.normal, color: theme.colors.textMuted, marginLeft: theme.spacing.sm }}>
              — data pulled from entity/assessment context at render time
            </span>
          </div>
          <div style={sectionStyles}>
            <p style={{ margin: `0 0 ${theme.spacing.md}`, color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.xs }}>
              Pre-fill is a convenience — if a mapping fails at runtime (field missing, type mismatch), the field is left empty. The form is never blocked.
            </p>
            {prefillQuestions.map((q) => <QuestionCard key={q.id} question={q} />)}
          </div>
        </div>
      )}

      {/* Questions — other fields */}
      {otherQuestions.length > 0 && (
        <div style={cardStyles}>
          <div style={cardHeaderStyles}>
            Form fields ({otherQuestions.length})
          </div>
          <div style={sectionStyles}>
            {otherQuestions.map((q) => <QuestionCard key={q.id} question={q} />)}
            <button style={{ ...btnSecondary, marginTop: theme.spacing.sm, fontSize: theme.typography.fontSize.xs }}>
              + Add question
            </button>
          </div>
        </div>
      )}

      {/* Branching & conditional logic */}
      <div style={cardStyles}>
        <div style={cardHeaderStyles}>Branching & conditional logic</div>
        <div style={sectionStyles}>
          <p style={{ margin: 0, color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm }}>
            Show/hide questions or sections based on previous answers within this form (e.g. "If Has UBOs = yes → show UBO details section").
            Branching rules are validated at publish time — rules referencing invalid questions or values block publishing.
          </p>
        </div>
      </div>

      {/* Deduplication */}
      <div style={cardStyles}>
        <div style={cardHeaderStyles}>Deduplication</div>
        <div style={sectionStyles}>
          <div style={formRowStyles}>
            <label style={{ ...labelStyles, display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <input type="checkbox" checked={dedupEnabled} onChange={(e) => setDedupEnabled(e.target.checked)} />
              <span>Enable deduplication</span>
            </label>
            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginLeft: '28px', display: 'block' }}>
              When enabled, a recipient who has already completed this form will not be asked again within the configured time window.
            </span>
          </div>

          {dedupEnabled && (
            <div style={{
              marginLeft: '28px', padding: theme.spacing.md,
              background: theme.colors.surfaceRaised, borderRadius: theme.radii.md,
              border: `1px solid ${theme.colors.border}`,
            }}>
              <div style={{ marginBottom: theme.spacing.md }}>
                <div style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text, marginBottom: theme.spacing.xs }}>
                  Dedup key
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted,
                  padding: theme.spacing.sm, background: '#f0f9ff', borderRadius: theme.radii.sm,
                  border: '1px solid #bae6fd',
                }}>
                  <strong>Form + Recipient.</strong> The recipient is whoever the form is about — the entity for entity-level forms, or the individual for director/UBO forms.
                  Dedup is version-agnostic (keyed on logical form ID, not version number).
                </div>
              </div>

              <div style={formRowStyles}>
                <label style={labelStyles}>Time window</label>
                <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
                  <select style={selectStyles} value={dedupWindow} onChange={(e) => setDedupWindow(e.target.value as DedupTimeWindow)}>
                    <option value="time_bound">Time-bound</option>
                    <option value="forever">Forever</option>
                  </select>
                  {dedupWindow === 'time_bound' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                      <input
                        type="number" style={{ ...inputStyles, maxWidth: '80px' }}
                        value={dedupDays} onChange={(e) => setDedupDays(e.target.value)}
                      />
                      <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted }}>days</span>
                    </div>
                  )}
                </div>
                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, display: 'block', marginTop: theme.spacing.xs }}>
                  {dedupWindow === 'time_bound'
                    ? `Responses older than ${dedupDays} days are treated as expired — the form will be re-sent.`
                    : 'Any valid response is reused with no time limit.'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* External form settings */}
      {channel === 'External' && (
        <div style={cardStyles}>
          <div style={cardHeaderStyles}>External form settings</div>
          <div style={sectionStyles}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
              <div style={formRowStyles}>
                <label style={labelStyles}>Sender email</label>
                <input type="email" style={inputStyles} placeholder="noreply@company.com" />
              </div>
              <div style={formRowStyles}>
                <label style={labelStyles}>Sender display name</label>
                <input type="text" style={inputStyles} placeholder="Acme Compliance Team" />
              </div>
              <div style={formRowStyles}>
                <label style={labelStyles}>External form URL</label>
                <input type="text" style={inputStyles} placeholder="https://forms.company.com" />
              </div>
              <div style={formRowStyles}>
                <label style={labelStyles}>Form expiry (days)</label>
                <input type="number" style={inputStyles} defaultValue={30} />
              </div>
            </div>
            <div style={formRowStyles}>
              <label style={labelStyles}>Email body</label>
              <textarea style={{ ...inputStyles, maxWidth: '100%', minHeight: '80px', resize: 'vertical' }} placeholder="Please complete the attached form..." />
            </div>
            <div style={formRowStyles}>
              <label style={{ ...labelStyles, display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <input type="checkbox" defaultChecked />
                <span>Enable automated reminders</span>
              </label>
              <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginLeft: '28px', display: 'block' }}>
                Send reminders if no response after the configured number of days.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Version history */}
      {!isNew && (
        <div style={cardStyles}>
          <div style={cardHeaderStyles}>Version history</div>
          <div style={sectionStyles}>
            {[
              { version: 2, publishedBy: 'Vithushan Varatharajan', publishedAt: '2026-03-18 14:30', status: 'Published (current)' },
              { version: 1, publishedBy: 'Vithushan Varatharajan', publishedAt: '2026-02-28 10:15', status: 'Superseded' },
            ].map((v) => (
              <div key={v.version} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: `${theme.spacing.sm} 0`,
                borderBottom: `1px solid ${theme.colors.borderLight}`,
              }}>
                <div>
                  <span style={{
                    fontWeight: theme.typography.fontWeight.semibold,
                    fontSize: theme.typography.fontSize.sm, marginRight: theme.spacing.sm,
                  }}>
                    v{v.version}
                  </span>
                  <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted }}>
                    Published by {v.publishedBy} on {v.publishedAt}
                  </span>
                </div>
                <span style={{
                  fontSize: theme.typography.fontSize.xs, padding: `2px ${theme.spacing.sm}`,
                  borderRadius: theme.radii.sm,
                  background: v.status.includes('current') ? theme.colors.successBg : '#f1f3f5',
                  color: v.status.includes('current') ? theme.colors.success : theme.colors.textMuted,
                }}>
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showValidation && (
        <PublishValidationModal
          onClose={() => setShowValidation(false)}
          onPublish={() => {
            setShowValidation(false);
            navigate('/forms');
          }}
        />
      )}
    </div>
  );
}
