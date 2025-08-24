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
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
      'Password must contain 1 number, 1 uppercase, 1 lowercase, and 1 special character',
    ),
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
      if (!file) return true;
      return file.size > 0;
    })
    .test('fileSize', 'File too large', (file) => {
      if (!file) return true;
      return file.size <= 1024 * 1024;
    })
    .test('fileType', 'Unsupported file type', (file) => {
      if (!file || file.size === 0) return true;
      return ['image/jpeg', 'image/png'].includes(file.type);
    }),
  country: yup
    .string()
    .required('Country is required')
    .oneOf(countries, 'Please select a valid country from the list'),
});
