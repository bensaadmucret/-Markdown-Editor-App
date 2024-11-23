import '@testing-library/jest-dom'
import * as React from 'react'

// Mock de l'éditeur Markdown
jest.mock('@uiw/react-md-editor', () => ({
  __esModule: true,
  default: ({ value, onChange, placeholder }: any) => 
    React.createElement('textarea', {
      'data-testid': 'md-editor',
      value,
      onChange: (e: any) => onChange(e.target.value),
      placeholder
    })
}))

// Mock des composants MUI Date Picker
jest.mock('@mui/x-date-pickers', () => ({
  DatePicker: ({ value, onChange, slotProps }: any) =>
    React.createElement('input', {
      type: 'date',
      value: value ? value.toISOString().split('T')[0] : '',
      onChange: (e: any) => onChange(new Date(e.target.value)),
      ...slotProps?.textField
    })
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
