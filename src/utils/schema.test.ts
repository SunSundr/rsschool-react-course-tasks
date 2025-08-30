import { describe, expect, test } from 'vitest';
import countries from './countries.json';
import { schema } from './schema';

const createMockFile = (size: number, type: string): File => {
  const blob = new Blob(['x'.repeat(size)], { type });
  return new File([blob], 'test.jpg', { type });
};

describe('Form Validation Schema', () => {
  describe('Name field validation', () => {
    test('should require name', async () => {
      await expect(schema.validateAt('name', { name: '' })).rejects.toThrow('Name is required');
    });

    test('should reject name starting with lowercase', async () => {
      await expect(schema.validateAt('name', { name: 'john' })).rejects.toThrow(
        'First letter must be uppercase',
      );
    });

    test('should accept name starting with uppercase', async () => {
      await expect(schema.validateAt('name', { name: 'John' })).resolves.toBe('John');
    });

    test('should accept empty value when not required in context', async () => {
      await expect(schema.validateAt('name', { name: undefined })).rejects.toThrow(
        'Name is required',
      );
    });
  });

  describe('Age field validation', () => {
    test('should require age', async () => {
      await expect(schema.validateAt('age', { age: undefined })).rejects.toThrow('Age is required');
    });

    test('should reject non-integer age', async () => {
      await expect(schema.validateAt('age', { age: 25.5 })).rejects.toThrow(
        'Age must be an integer',
      );
    });

    test('should reject negative age', async () => {
      await expect(schema.validateAt('age', { age: -5 })).rejects.toThrow('Age must be positive');
    });

    test('should reject age below 18', async () => {
      await expect(schema.validateAt('age', { age: 17 })).rejects.toThrow(
        'You must be at least 18 years old',
      );
    });

    test('should reject age above 100', async () => {
      await expect(schema.validateAt('age', { age: 101 })).rejects.toThrow(
        'You are too old or have entered your age incorrectly',
      );
    });

    test('should accept valid age between 18 and 100', async () => {
      await expect(schema.validateAt('age', { age: 25 })).resolves.toBe(25);
      await expect(schema.validateAt('age', { age: 18 })).resolves.toBe(18);
      await expect(schema.validateAt('age', { age: 100 })).resolves.toBe(100);
    });
  });

  describe('Email field validation', () => {
    test('should require email', async () => {
      await expect(schema.validateAt('email', { email: '' })).rejects.toThrow('Email is required');
    });

    test('should reject invalid email format', async () => {
      await expect(schema.validateAt('email', { email: 'invalid-email' })).rejects.toThrow(
        'Invalid email',
      );
      await expect(schema.validateAt('email', { email: 'user@' })).rejects.toThrow('Invalid email');
      await expect(schema.validateAt('email', { email: 'user@domain' })).rejects.toThrow(
        'Invalid email',
      );
    });

    test('should accept valid email format', async () => {
      await expect(schema.validateAt('email', { email: 'test@example.com' })).resolves.toBe(
        'test@example.com',
      );
      await expect(schema.validateAt('email', { email: 'user.name@domain.co.uk' })).resolves.toBe(
        'user.name@domain.co.uk',
      );
    });
  });

  describe('Password field validation', () => {
    test('should require password', async () => {
      await expect(schema.validateAt('password', { password: '' })).rejects.toThrow(
        'Password is required',
      );
    });

    test('should reject password shorter than 8 characters', async () => {
      await expect(schema.validateAt('password', { password: 'Short1!' })).rejects.toThrow(
        'Password must be at least 8 characters',
      );
    });

    test('should reject password without required character types', async () => {
      await expect(schema.validateAt('password', { password: 'NoNumber!' })).rejects.toThrow(
        'Password must contain: 1\u00A0number',
      );
      await expect(schema.validateAt('password', { password: 'UPPERCASE1!' })).rejects.toThrow(
        'Password must contain: 1\u00A0lowercase\u00A0letter',
      );
      await expect(schema.validateAt('password', { password: 'lowercase1!' })).rejects.toThrow(
        'Password must contain: 1\u00A0uppercase\u00A0letter',
      );
      await expect(schema.validateAt('password', { password: 'NoSpecial1' })).rejects.toThrow(
        'Password must contain: 1\u00A0special\u00A0character',
      );
      await expect(schema.validateAt('password', { password: '12345678' })).rejects.toThrow(
        'Password must contain: 1\u00A0lowercase\u00A0letter, 1\u00A0uppercase\u00A0letter, 1\u00A0special\u00A0character',
      );
    });

    test('should accept valid password with all required character types', async () => {
      await expect(schema.validateAt('password', { password: 'ValidPass1!' })).resolves.toBe(
        'ValidPass1!',
      );
      await expect(schema.validateAt('password', { password: 'Another123$' })).resolves.toBe(
        'Another123$',
      );
    });
  });

  describe('Confirm Password field validation', () => {
    test('should require confirm password', async () => {
      await expect(
        schema.validateAt('confirmPassword', { password: 'ValidPass1!' }),
      ).rejects.toThrow('Confirm Password is required');
    });

    test('should reject when passwords do not match', async () => {
      await expect(
        schema.validateAt('confirmPassword', {
          password: 'ValidPass1!',
          confirmPassword: 'Different1!',
        }),
      ).rejects.toThrow('Passwords must match');
    });

    test('should accept when passwords match', async () => {
      await expect(
        schema.validateAt('confirmPassword', {
          password: 'ValidPass1!',
          confirmPassword: 'ValidPass1!',
        }),
      ).resolves.toBe('ValidPass1!');
    });
  });

  describe('Gender field validation', () => {
    test('should require gender', async () => {
      await expect(schema.validateAt('gender', { gender: '' })).rejects.toThrow(
        'Gender is required',
      );
      await expect(schema.validateAt('gender', { gender: undefined })).rejects.toThrow(
        'Gender is required',
      );
    });

    test('should accept any non-empty string as gender', async () => {
      await expect(schema.validateAt('gender', { gender: 'male' })).resolves.toBe('male');
      await expect(schema.validateAt('gender', { gender: 'female' })).resolves.toBe('female');
      await expect(schema.validateAt('gender', { gender: 'other' })).resolves.toBe('other');
    });
  });

  describe('Terms field validation', () => {
    test('should require terms acceptance', async () => {
      await expect(schema.validateAt('terms', { terms: false })).rejects.toThrow(
        'You must accept the terms',
      );
      await expect(schema.validateAt('terms', { terms: undefined })).rejects.toThrow(
        'Terms are required',
      );
    });

    test('should accept when terms are accepted', async () => {
      await expect(schema.validateAt('terms', { terms: true })).resolves.toBe(true);
    });
  });

  describe('Picture field validation', () => {
    test('should require picture', async () => {
      await expect(schema.validateAt('picture', { picture: undefined })).rejects.toThrow(
        'Picture is required',
      );
      await expect(schema.validateAt('picture', { picture: null })).rejects.toThrow(
        'Picture is required',
      );
    });

    test('should reject empty file', async () => {
      const emptyFile = createMockFile(0, 'image/jpeg');
      await expect(schema.validateAt('picture', { picture: emptyFile })).rejects.toThrow(
        'Picture is required',
      );
    });

    test('should reject file larger than 1MB', async () => {
      const largeFile = createMockFile(1024 * 1024 + 1, 'image/jpeg');
      await expect(schema.validateAt('picture', { picture: largeFile })).rejects.toThrow(
        'File too large',
      );
    });

    test('should reject unsupported file type', async () => {
      const invalidTypeFile = createMockFile(1000, 'application/pdf');
      await expect(schema.validateAt('picture', { picture: invalidTypeFile })).rejects.toThrow(
        'Unsupported file type',
      );
    });

    test('should accept valid image file', async () => {
      const validJpeg = createMockFile(500000, 'image/jpeg');
      const validPng = createMockFile(500000, 'image/png');

      await expect(schema.validateAt('picture', { picture: validJpeg })).resolves.toBe(validJpeg);
      await expect(schema.validateAt('picture', { picture: validPng })).resolves.toBe(validPng);
    });
  });

  describe('Country field validation', () => {
    test('should require country', async () => {
      await expect(schema.validateAt('country', { country: '' })).rejects.toThrow(
        'Please select a valid country from the list',
      );
      await expect(schema.validateAt('country', { country: undefined })).rejects.toThrow(
        'Country is required',
      );
    });

    test('should reject invalid country', async () => {
      await expect(schema.validateAt('country', { country: 'InvalidCountry' })).rejects.toThrow(
        'Please select a valid country from the list',
      );
    });

    test('should accept valid country from the list', async () => {
      const validCountry = countries[0]; // First country from the list
      await expect(schema.validateAt('country', { country: validCountry })).resolves.toBe(
        validCountry,
      );
    });
  });

  describe('Complete form validation', () => {
    test('should validate complete valid form', async () => {
      const validFormData = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'ValidPass1!',
        confirmPassword: 'ValidPass1!',
        gender: 'male',
        terms: true,
        picture: createMockFile(500000, 'image/jpeg'),
        country: countries[0],
      };

      await expect(schema.validate(validFormData, { abortEarly: false })).resolves.toEqual(
        validFormData,
      );
    });

    test('should reject incomplete form with multiple errors', async () => {
      const invalidFormData = {
        name: 'john',
        age: 17,
        email: 'invalid-email',
        password: 'short',
        confirmPassword: 'mismatch',
        gender: '',
        terms: false,
        picture: undefined,
        country: 'InvalidCountry',
      };

      await expect(schema.validate(invalidFormData, { abortEarly: false })).rejects.toThrow(); // Multiple validation errors
    });
  });
});
