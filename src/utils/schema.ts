import * as yup from 'yup';
import countries from './countries.json';

export const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .test('starts-with-uppercase', 'First letter must be uppercase', (value) => {
      if (value && value.length > 0) return /^[A-Z]/.test(value);
      return true;
    }),
  age: yup
    .number()
    .required('Age is required')
    .typeError('Age is required')
    .integer('Age must be an integer')
    .positive('Age must be positive')
    .test('is-adult', 'You must be at least 18 years old', (value) => {
      if (value) return value >= 18;
      return true;
    })
    .test('over-adult', 'You are too old or have entered your age incorrectly', (value) => {
      if (value) return value <= 100;
      return true;
    }),
  email: yup
    .string()
    .required('Email is required')
    .test('is-valid-email', 'Invalid email', (value) => {
      if (value && value.length > 0) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      return true;
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .test('password-strength', (value, { createError, path }) => {
      if (!value) return true;

      const checks = {
        number: { regex: /\d/, message: 'number' },
        lowercase: { regex: /[a-z]/, message: 'lowercase\u00A0letter' },
        uppercase: { regex: /[A-Z]/, message: 'uppercase\u00A0letter' },
        special: { regex: /\W/, message: 'special\u00A0character' },
      };

      const missing: string[] = [];

      Object.values(checks).forEach((check) => {
        if (!check.regex.test(value)) missing.push(`1\u00A0${check.message}`);
      });

      if (missing.length === 0) return true;

      return createError({
        message: `Password must contain: ${missing.join(', ')}`,
        path,
      });
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  gender: yup.string().required('Gender is required'),
  terms: yup.boolean().oneOf([true], 'You must accept the terms').required('Terms are required'),
  picture: yup
    .mixed<File>()
    .required('Picture is required')
    .test('Required', 'Picture is required', (file) => {
      return file instanceof File && file.size > 0;
    })
    .test('fileType', 'Unsupported file type', (file) => {
      if (!file || file.size === 0) return true;
      return ['image/jpeg', 'image/png'].includes(file.type);
    })
    .test('fileSize', 'File too large', (file) => {
      if (!file) return true;
      return file.size <= 1024 * 1024;
    })
    .nullable(),
  country: yup
    .string()
    .required('Country is required')
    .oneOf(countries, 'Please select a valid country from the list'),
});
