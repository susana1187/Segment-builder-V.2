import Box from '@liveramp/motif/core/Box'
import type { CatalogItemType } from '../../types/catalog'
import type { RuleValueChip } from '../../types/segment'
import { OperatorMenu } from './OperatorMenu'
import { EditableValueChips } from './EditableValueChips'

const OPERATORS_BY_TYPE: Partial<Record<CatalogItemType, string[]>> = {
  'attribute-numeric': ['is equal to', 'is not equal to', 'is greater than', 'is less than'],
  'attribute-text': ['is equal to', 'is not equal to', 'contains'],
  'attribute-date': ['is on', 'is before', 'is after'],
  'attribute-boolean': ['is'],
}

function BooleanValueToggle({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {['True', 'False'].map((option) => (
        <Box
          key={option}
          onClick={() => onChange(option)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 20,
            fontSize: 11,
            px: 0.75,
            borderRadius: 10,
            cursor: 'pointer',
            userSelect: 'none',
            bgcolor: value === option ? 'primary.main' : 'action.selected',
            color: value === option ? 'primary.contrastText' : 'text.primary',
          }}
        >
          {option}
        </Box>
      ))}
    </Box>
  )
}

export function AttributeValueChips({
  type,
  operator,
  values,
  onOperatorChange,
  onValuesChange,
}: {
  type: CatalogItemType
  operator?: string
  values?: RuleValueChip[]
  onOperatorChange: (operator: string) => void
  onValuesChange: (values: RuleValueChip[]) => void
}) {
  if (!operator || !values) return null
  const options = OPERATORS_BY_TYPE[type] ?? [operator]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, ml: 1 }}>
      <OperatorMenu value={operator} options={options} onChange={onOperatorChange} />
      {type === 'attribute-boolean' ? (
        <BooleanValueToggle
          value={values[0]?.label}
          onChange={(label) => onValuesChange([{ id: values[0]?.id ?? 'bool-value', label }])}
        />
      ) : type === 'attribute-date' ? (
        <Box
          component="input"
          type="date"
          value={values[0]?.label ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onValuesChange([{ id: values[0]?.id ?? 'date-value', label: e.target.value }])}
          sx={{ font: 'inherit', fontSize: 12, border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 0.5, height: 22 }}
        />
      ) : (
        <EditableValueChips values={values} onChange={onValuesChange} />
      )}
    </Box>
  )
}
