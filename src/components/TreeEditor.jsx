import { useState } from 'react'

const toLabel = (value) => String(value).replace(/_/gu, ' ')

export default function TreeEditor({ data, onChange, path = [] }) {
  const [newFieldKey, setNewFieldKey] = useState('')
  const [showAddField, setShowAddField] = useState(false)

  // Handle arrays with add/remove functionality
  if (Array.isArray(data)) {
    const handleAddEmpty = () => {
      if (data.length === 0) {
        onChange([...data, {}])
      } else {
        const lastItem = data[data.length - 1]
        if (typeof lastItem === 'object' && lastItem !== null) {
          const newItem = Array.isArray(lastItem)
            ? []
            : Object.keys(lastItem).reduce((acc, key) => ({ ...acc, [key]: null }), {})
          onChange([...data, newItem])
        } else {
          onChange([...data, ''])
        }
      }
    }

    const handleDuplicate = () => {
      if (data.length === 0) {
        onChange([{}])
      } else {
        const lastItem = data[data.length - 1]
        const cloned = JSON.parse(JSON.stringify(lastItem))
        onChange([...data, cloned])
      }
    }

    const handleRemove = (index) => {
      const updated = data.filter((_, i) => i !== index)
      onChange(updated)
    }

    return (
      <div style={{ marginLeft: '16px', border: '1px solid #e0e0e0', padding: '12px', borderRadius: '6px', background: '#fafafa' }}>
        {data.map((item, index) => (
          <div key={`${path.join('.')}.${index}`} style={{ marginBottom: '12px', padding: '8px', background: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#555' }}>{`Item ${index + 1}`}</div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  border: '1px solid #f44336',
                  borderRadius: '4px',
                  background: '#fff',
                  color: '#f44336',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
            <TreeEditor
              data={item}
              onChange={(next) => {
                const updated = [...data]
                updated[index] = next
                onChange(updated)
              }}
              path={[...path, index]}
            />
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={handleAddEmpty}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              border: '1px solid #4caf50',
              borderRadius: '4px',
              background: '#fff',
              color: '#4caf50',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            + Add Empty
          </button>
          {data.length > 0 && (
            <button
              type="button"
              onClick={handleDuplicate}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                border: '1px solid #2196f3',
                borderRadius: '4px',
                background: '#fff',
                color: '#2196f3',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              + Duplicate Last
            </button>
          )}
        </div>
      </div>
    )
  }

  // Handle objects with add field functionality
  if (data && typeof data === 'object') {
    const handleAddField = () => {
      if (newFieldKey.trim() && !Object.prototype.hasOwnProperty.call(data, newFieldKey.trim())) {
        onChange({ ...data, [newFieldKey.trim()]: '' })
        setNewFieldKey('')
        setShowAddField(false)
      }
    }

    const handleRemoveField = (key) => {
      const { [key]: _Removed, ...rest } = data
      onChange(rest)
    }

    return (
      <div style={{ marginLeft: path.length ? '16px' : '0' }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={`${path.join('.')}.${key}`} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#333' }}>{toLabel(key)}</div>
              <button
                type="button"
                onClick={() => handleRemoveField(key)}
                style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  border: '1px solid #ff9800',
                  borderRadius: '3px',
                  background: '#fff',
                  color: '#ff9800',
                  cursor: 'pointer',
                }}
              >
                Remove Field
              </button>
            </div>
            <TreeEditor
              data={value}
              onChange={(next) => onChange({ ...data, [key]: next })}
              path={[...path, key]}
            />
          </div>
        ))}
        {Object.keys(data).length === 0 && (
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>No fields available.</div>
        )}
        {showAddField ? (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="text"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
              placeholder="Field name"
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '13px',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddField()
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddField}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                border: '1px solid #2196f3',
                borderRadius: '4px',
                background: '#2196f3',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddField(false)
                setNewFieldKey('')
              }}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: '#fff',
                color: '#666',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddField(true)}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              border: '1px solid #2196f3',
              borderRadius: '4px',
              background: '#fff',
              color: '#2196f3',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            + Add Field
          </button>
        )}
      </div>
    )
  }

  // Handle primitives with type detection
  const handlePrimitiveChange = (value) => {
    if (typeof data === 'boolean') {
      onChange(value === 'true')
    } else if (typeof data === 'number') {
      const parsed = parseFloat(value)
      onChange(isNaN(parsed) ? value : parsed)
    } else {
      onChange(value)
    }
  }

  // Boolean input
  if (typeof data === 'boolean') {
    return (
      <select
        value={String(data)}
        onChange={(e) => onChange(e.target.value === 'true')}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    )
  }

  // Number input
  if (typeof data === 'number') {
    return (
      <input
        type="number"
        value={data}
        onChange={(e) => {
          const val = e.target.value
          onChange(val === '' ? null : parseFloat(val))
        }}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      />
    )
  }

  // Null value with conversion options
  if (data === null) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value=""
          placeholder="null"
          disabled
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: '#f5f5f5',
            color: '#999',
          }}
        />
        <button
          type="button"
          onClick={() => onChange({})}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            border: '1px solid #2196f3',
            borderRadius: '4px',
            background: '#fff',
            color: '#2196f3',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          → Object
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            border: '1px solid #4caf50',
            borderRadius: '4px',
            background: '#fff',
            color: '#4caf50',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          → Array
        </button>
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            border: '1px solid #ff9800',
            borderRadius: '4px',
            background: '#fff',
            color: '#ff9800',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          → Text
        </button>
      </div>
    )
  }

  // Text/string input (default)
  return (
    <input
      type="text"
      value={data ?? ''}
      onChange={(e) => handlePrimitiveChange(e.target.value)}
      style={{
        width: '100%',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #ccc',
      }}
    />
  )
}
