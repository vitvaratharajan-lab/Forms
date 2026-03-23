import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../theme';

type DataLane = 'form_local' | 'entity_override' | 'custom_data';
type PrefillBehaviour = 'read_only' | 'prefill_only' | 'prefill_and_override';

interface FormQuestion {
  id: string;
  type: string;
  title: string;
  name: string;
  isRequired?: boolean;
  visibleIf?: string;
  dataLane: DataLane;
  prefillBehaviour?: PrefillBehaviour;
  mappedField?: string;
  mappedSource?: string;
}

const mockQuestions: FormQuestion[] = [
  {
    id: 'q1', type: 'text', title: 'Entity name', name: 'entityName', isRequired: true,
    dataLane: 'entity_override', prefillBehaviour: 'prefill_and_override',
    mappedField: 'entity.companyName', mappedSource: 'Entity Service',
  },
  {
    id: 'q2', type: 'text', title: 'Registered address', name: 'registeredAddress', isRequired: true,
    dataLane: 'entity_override', prefillBehaviour: 'prefill_and_override',
    mappedField: 'entity.registeredAddress', mappedSource: 'Entity Service',
  },
  {
    id: 'q3', type: 'text', title: 'Incorporation number', name: 'incorporationNumber',
    dataLane: 'entity_override', prefillBehaviour: 'read_only',
    mappedField: 'entity.incorporationNumber', mappedSource: 'Entity Service',
  },
  {
    id: 'q4', type: 'dropdown', title: 'Entity type', name: 'entityType', isRequired: true,
    dataLane: 'entity_override', prefillBehaviour: 'prefill_only',
    mappedField: 'entity.entityType', mappedSource: 'Entity Service',
  },
  {
    id: 'q5', type: 'dropdown', title: 'Supplier tier', name: 'supplierTier',
    dataLane: 'custom_data', prefillBehaviour: 'prefill_and_override',
    mappedField: 'custom.supplierTier', mappedSource: 'Custom Data Service',
  },
  {
    id: 'q6', type: 'text', title: 'Internal risk rating', name: 'internalRiskRating',
    dataLane: 'custom_data', prefillBehaviour: 'prefill_and_override',
    mappedField: 'custom.internalRiskRating', mappedSource: 'Custom Data Service',
  },
  {
    id: 'q7', type: 'boolean', title: 'Has UBOs?', name: 'hasUbo',
    dataLane: 'form_local',
  },
  {
    id: 'q8', type: 'panel', title: 'UBO details', name: 'uboDetails', visibleIf: '{hasUbo} = true',
    dataLane: 'form_local',
  },
  {
    id: 'q9', type: 'textarea', title: 'Analyst justification', name: 'analystNotes',
    dataLane: 'form_local',
  },
];

const entityFields = [
  'entity.companyName', 'entity.registeredAddress', 'entity.incorporationNumber',
  'entity.entityType', 'entity.countryOfIncorporation', 'entity.legalForm',
  'entity.dateOfIncorporation', 'entity.tradingNames', 'entity.status',
];

const customFields = [
  'custom.supplierTier', 'custom.internalRiskRating', 'custom.productLine',
  'custom.businessUnit', 'custom.annualRevenue', 'custom.contractStartDate',
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
  fontWeight: theme.typography.fontWeight.medium,
};

const btnPrimary: React.CSSProperties = {
  padding: `${theme.spacing.sm} ${theme.spacing.md}`, background: theme.colors.primary,
  color: '#fff', border: 'none', borderRadius: theme.radii.md,
  fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium,
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

const visibilityNote: React.CSSProperties = {
  fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted,
  marginTop: theme.spacing.xs,
};

function dataLaneBadge(lane: DataLane): React.CSSProperties {
  const colors: Record<DataLane, { bg: string; fg: string }> = {
    entity_override: { bg: '#e0f2fe', fg: '#0369a1' },
    custom_data: { bg: '#f3e8ff', fg: '#7c3aed' },
    form_local: { bg: '#f1f3f5', fg: '#4b5563' },
  };
  return {
    display: 'inline-block', padding: `2px ${theme.spacing.sm}`,
    background: colors[lane].bg, color: colors[lane].fg,
    borderRadius: theme.radii.sm, fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium, marginRight: theme.spacing.sm,
  };
}

const colours = {
  read_only: { bg: '#f1f3f5', fg: '#6b7280' },
  prefill_only: { bg: '#fef3c7', fg: '#b45309' },
  prefill_and_override: { bg: '#dcfce7', fg: '#166534' },
};

function BehaviourBadge({ behaviour }: { behaviour: PrefillBehaviour }) {
  const c = colours[behaviour];
  const labels: Record<PrefillBehaviour, string> = {
    read_only: 'Read-only',
    prefill_only: 'Pre-fill only',
    prefill_and_override: 'Pre-fill & Override',
  };
  return (
    <span style={{
      display: 'inline-block', padding: `2px ${theme.spacing.sm}`,
      background: c.bg, color: c.fg, borderRadius: theme.radii.sm,
      fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium,
      marginRight: theme.spacing.sm,
    }}>
      {labels[behaviour]}
    </span>
  );
}

const laneLabels: Record<DataLane, string> = {
  entity_override: 'Entity Override',
  custom_data: 'Custom Data',
  form_local: 'Form-Local',
};

const selectStyles: React.CSSProperties = {
  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.sm,
  fontSize: theme.typography.fontSize.xs, background: '#fff',
};

function DataMappingRow({ question, onUpdate }: { question: FormQuestion; onUpdate: (q: FormQuestion) => void }) {
  const isMapped = question.dataLane !== 'form_local';
  const fields = question.dataLane === 'entity_override' ? entityFields
    : question.dataLane === 'custom_data' ? customFields : [];

  return (
    <div style={{
      ...questionCardStyles,
      borderLeft: `3px solid ${
        question.dataLane === 'entity_override' ? '#0369a1'
          : question.dataLane === 'custom_data' ? '#7c3aed' : '#d1d5db'
      }`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <div>
          <span style={questionTypeBadge}>{question.type}</span>
          <span style={dataLaneBadge(question.dataLane)}>{laneLabels[question.dataLane]}</span>
          {question.prefillBehaviour && <BehaviourBadge behaviour={question.prefillBehaviour} />}
          <strong style={{ fontSize: theme.typography.fontSize.sm }}>{question.title}</strong>
          {question.isRequired && (
            <span style={{ marginLeft: theme.spacing.sm, color: theme.colors.error, fontSize: theme.typography.fontSize.xs }}>Required</span>
          )}
        </div>
      </div>

      {isMapped && (
        <div style={{
          marginTop: theme.spacing.sm, padding: theme.spacing.sm,
          background: question.dataLane === 'entity_override' ? '#f0f9ff' : '#faf5ff',
          borderRadius: theme.radii.sm, fontSize: theme.typography.fontSize.xs,
        }}>
          <div style={{ display: 'flex', gap: theme.spacing.md, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <span style={{ color: theme.colors.textMuted }}>Mapped to: </span>
              <select style={selectStyles} value={question.mappedField || ''} onChange={(e) => onUpdate({ ...question, mappedField: e.target.value })}>
                <option value="">— Select field —</option>
                {fields.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <span style={{ color: theme.colors.textMuted }}>Behaviour: </span>
              <select
                style={selectStyles}
                value={question.prefillBehaviour || 'prefill_only'}
                onChange={(e) => onUpdate({ ...question, prefillBehaviour: e.target.value as PrefillBehaviour })}
              >
                <option value="read_only">Read-only</option>
                <option value="prefill_only">Pre-fill only (no write-back)</option>
                <option value="prefill_and_override">Pre-fill & Override (write-back)</option>
              </select>
            </div>
            <div>
              <span style={{ color: theme.colors.textMuted }}>Source: </span>
              <span style={{ fontWeight: theme.typography.fontWeight.medium }}>{question.mappedSource}</span>
            </div>
          </div>
          {question.prefillBehaviour === 'prefill_and_override' && (
            <div style={{ marginTop: theme.spacing.xs, color: '#166534', fontSize: theme.typography.fontSize.xs }}>
              Edits to this field will trigger a data override on submission. If review is configured, a review task will be created.
            </div>
          )}
          {question.prefillBehaviour === 'read_only' && (
            <div style={{ marginTop: theme.spacing.xs, color: '#6b7280', fontSize: theme.typography.fontSize.xs }}>
              This field is displayed for context only and cannot be edited by the form respondent.
            </div>
          )}
          {question.prefillBehaviour === 'prefill_only' && (
            <div style={{ marginTop: theme.spacing.xs, color: '#b45309', fontSize: theme.typography.fontSize.xs }}>
              Pre-filled from source data. Edits are stored in the form response only — no write-back to the source.
            </div>
          )}
        </div>
      )}

      {!isMapped && (
        <div style={{
          marginTop: theme.spacing.xs, fontSize: theme.typography.fontSize.xs,
          color: theme.colors.textMuted,
        }}>
          {question.visibleIf && <span>Visible when: {question.visibleIf} · </span>}
          Data stored in form response only (assessment-scoped).
        </div>
      )}
    </div>
  );
}

export function FormConfig() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const isNew = formId === undefined || formId === 'new';
  const [formName, setFormName] = useState(isNew ? 'New form' : 'KYB Entity Onboarding');
  const [formDescription, setFormDescription] = useState('Configure sections, questions and branching for this form.');
  const [questions, setQuestions] = useState<FormQuestion[]>(mockQuestions);

  const updateQuestion = (updated: FormQuestion) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  };

  const entityQuestions = questions.filter((q) => q.dataLane === 'entity_override');
  const customQuestions = questions.filter((q) => q.dataLane === 'custom_data');
  const localQuestions = questions.filter((q) => q.dataLane === 'form_local');

  return (
    <div style={pageStyles}>
      <div style={headerRowStyles}>
        <h1 style={titleStyles}>{isNew ? 'New form' : 'Configure form'}</h1>
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <button style={btnSecondary} onClick={() => navigate('/forms')}>Cancel</button>
          <button style={btnPrimary}>Save</button>
        </div>
      </div>

      {/* Form metadata */}
      <div style={cardStyles}>
        <div style={cardHeaderStyles}>Form details</div>
        <div style={sectionStyles}>
          <div style={formRowStyles}>
            <label style={labelStyles}>Form name</label>
            <input type="text" style={inputStyles} value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. KYB Entity Onboarding" />
          </div>
          <div style={formRowStyles}>
            <label style={labelStyles}>Description</label>
            <input type="text" style={inputStyles} value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Brief description of the form" />
          </div>
        </div>
      </div>

      {/* Data mapping legend */}
      <div style={{ ...cardStyles, borderLeft: 'none' }}>
        <div style={cardHeaderStyles}>Data mapping legend</div>
        <div style={{ ...sectionStyles, display: 'flex', gap: theme.spacing.lg, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#0369a1', display: 'inline-block' }} />
            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textSecondary }}>Entity Override — pre-filled from Entity Service, edits write back as overrides</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#7c3aed', display: 'inline-block' }} />
            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textSecondary }}>Custom Data — pre-filled from Custom Data Service, edits write back to custom fields</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#d1d5db', display: 'inline-block' }} />
            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textSecondary }}>Form-Local — data lives in the form response only (assessment-scoped)</span>
          </div>
        </div>
      </div>

      {/* Entity Override fields */}
      {entityQuestions.length > 0 && (
        <div style={cardStyles}>
          <div style={{ ...cardHeaderStyles, borderLeft: '3px solid #0369a1' }}>
            Entity data fields (pre-filled from Entity Service)
          </div>
          <div style={sectionStyles}>
            <p style={{ margin: `0 0 ${theme.spacing.md}`, color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.xs }}>
              These fields are mapped to entity data. The pre-fill behaviour determines whether edits write back as entity data overrides.
            </p>
            {entityQuestions.map((q) => (
              <DataMappingRow key={q.id} question={q} onUpdate={updateQuestion} />
            ))}
          </div>
        </div>
      )}

      {/* Custom Data fields */}
      {customQuestions.length > 0 && (
        <div style={cardStyles}>
          <div style={{ ...cardHeaderStyles, borderLeft: '3px solid #7c3aed' }}>
            Custom data fields (pre-filled from Custom Data Service)
          </div>
          <div style={sectionStyles}>
            <p style={{ margin: `0 0 ${theme.spacing.md}`, color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.xs }}>
              These fields are mapped to custom fields. Edits can write back to the Custom Data Service.
            </p>
            {customQuestions.map((q) => (
              <DataMappingRow key={q.id} question={q} onUpdate={updateQuestion} />
            ))}
            <button style={{ ...btnSecondary, marginTop: theme.spacing.sm, fontSize: theme.typography.fontSize.xs }}>
              + Create new custom field
            </button>
          </div>
        </div>
      )}

      {/* Form-local fields */}
      {localQuestions.length > 0 && (
        <div style={cardStyles}>
          <div style={{ ...cardHeaderStyles, borderLeft: '3px solid #d1d5db' }}>
            Form-local fields (assessment-scoped)
          </div>
          <div style={sectionStyles}>
            <p style={{ margin: `0 0 ${theme.spacing.md}`, color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.xs }}>
              These fields are not mapped to external data sources. Data is stored in the form response only.
            </p>
            {localQuestions.map((q) => (
              <DataMappingRow key={q.id} question={q} onUpdate={updateQuestion} />
            ))}
            <button style={btnSecondary}>+ Add question</button>
          </div>
        </div>
      )}

      {/* Branching & validation */}
      <div style={cardStyles}>
        <div style={cardHeaderStyles}>Branching & validation</div>
        <div style={sectionStyles}>
          <p style={{ margin: 0, color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm }}>
            Conditional visibility and skip logic are configured per question (e.g. "Show UBO details when Has UBOs = true"). Validation rules can be added in the full config UI.
          </p>
        </div>
      </div>

      {/* Override review settings */}
      <div style={cardStyles}>
        <div style={cardHeaderStyles}>Override review settings</div>
        <div style={sectionStyles}>
          <p style={{ margin: `0 0 ${theme.spacing.md}`, color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.xs }}>
            Configure whether entity overrides and custom data changes from this form require review before being applied.
          </p>
          <div style={formRowStyles}>
            <label style={{ ...labelStyles, display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <input type="checkbox" defaultChecked />
              <span>Require review for entity data overrides</span>
            </label>
            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginLeft: '28px', display: 'block' }}>
              When enabled, changes to entity data fields create a review task. When disabled, overrides are applied automatically on form submission.
            </span>
          </div>
          <div style={formRowStyles}>
            <label style={{ ...labelStyles, display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <input type="checkbox" defaultChecked />
              <span>Require review for custom data changes</span>
            </label>
            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textMuted, marginLeft: '28px', display: 'block' }}>
              When enabled, changes to custom data fields create a review task. When disabled, values are written directly to the Custom Data Service.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
