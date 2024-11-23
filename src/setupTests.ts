import '@testing-library/jest-dom'

// Mock de l'éditeur Markdown
jest.mock('@uiw/react-md-editor', () => {
  return {
    __esModule: true,
    default: ({ value, onChange, placeholder }: any) => (
      <textarea
        data-testid="md-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ),
  }
})

// Mock des composants MUI Date Picker
jest.mock('@mui/x-date-pickers', () => ({
  DatePicker: ({ value, onChange, slotProps }: any) => (
    <input
      type="date"
      value={value ? value.toISOString().split('T')[0] : ''}
      onChange={(e) => onChange(new Date(e.target.value))}
      {...slotProps?.textField}
    />
  ),
}))

// Configuration globale pour éviter les erreurs de rendu MUI
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
