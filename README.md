# React Forms with Portals and State Management

A React application demonstrating controlled vs uncontrolled form approaches using React Portals, Redux state management, and comprehensive form validation.

## Completed Features

### React Portals Implementation

- **Modal System**: Shared modal component using React Portals for proper DOM rendering
- **Accessibility**: Full focus management, ESC key support, and click-outside-to-close functionality
- **Two Form Approaches**:
  - Uncontrolled components with manual form data handling
  - React Hook Form with built-in validation and state management

### State Management with Redux

- **Centralized Store**: Redux store managing form submissions and application state
- **Form History**: All submissions stored and displayed as responsive cards
- **Visual Feedback**: New submissions highlighted with temporary border styling
- **Country Data**: Pre-loaded countries list for autocomplete functionality

### Comprehensive Form Validation

- **Validation Schema**: Yup-based validation with consistent error handling
- **Field Validations**:
  - Name: First letter must be uppercase
  - Age: Numeric, positive values only (18-100)
  - Email: Standard email format validation
  - Password: Complex requirements (8+ chars, uppercase, lowercase, number, special char)
  - Password Confirmation: Must match primary password
  - Gender: Required selection
  - Terms: Must be accepted
  - Picture: File size (≤1MB) and type (PNG/JPEG) validation
  - Country: Must be selected from provided list

### User Experience Features

- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Live Validation**: React Hook Form provides real-time validation feedback
- **Dropzone Integration**: Drag-and-drop file upload with automatic validation in controlled form
- **Interactive Controls**: Hide/show password button and clear button on all user input fields
- **Submit Behavior**:
  - Hook Form: Submit button disabled during validation errors
  - Uncontrolled Form: Validation on submit only
- **Visual Feedback**: 3-second highlight for newly submitted entries
- **No Layout Shifts**: Fixed height error containers prevent UI jumping

### Technical Implementation

- **File Handling**: Image upload with base64 conversion and preview
- **Autocomplete**: Country selection with search functionality
- **MUI-Style Components**: Universal input components with Material-UI inspired design and adaptive responsive layout
- **Form Components**: Reusable Input, Select, Button, and Checkbox components with consistent styling
- **CSS Modules**: Scoped styling with CSS custom properties for theming
- **TypeScript**: Full type safety throughout the application

### Testing Coverage

- **Comprehensive Tests**: Vitest and React Testing Library
- **Component Testing**: All major components with mocked dependencies
- **Integration Testing**: Form submission flows and state management
- **Accessibility Testing**: Modal behavior and keyboard navigation

## Project Structure

```
src/
├── components/
│   ├── Button/           # Reusable button component
│   ├── Checkbox/         # Custom checkbox with styling
│   ├── FormFields/       # Shared form fields layout
│   ├── HookForm/         # React Hook Form implementation
│   ├── Input/            # Custom input with validation
│   ├── MainComponent/    # Main page with form history
│   ├── Modal/            # Portal-based modal component
│   ├── Select/           # Custom select with autocomplete
│   └── UncontrolledForm/ # Traditional form implementation
├── store/                # Redux store and slices
├── utils/                # Validation schemas and utilities
└── types.ts              # TypeScript type definitions
```

## Key Technologies

- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **React Hook Form** with Yup validation
- **React Portals** for modal rendering
- **CSS Modules** with custom properties
- **Vitest** and React Testing Library for testing

## Running the Project

```bash
npm ci
npm run dev        # Development server
npm run test       # Run tests
npm run build      # Production build
```

The application demonstrates modern React patterns with emphasis on accessibility, user experience, and maintainable code architecture.
