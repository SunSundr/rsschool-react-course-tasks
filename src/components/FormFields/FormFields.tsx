import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';
import { FormValues } from '~/types';
import { checkPasswordStrength } from '~/utils/passwordStrength';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import styles from './FormFields.module.css';

interface FormFieldsProps {
  register?: UseFormRegister<FormValues>;
  errors?: FieldErrors<FormValues> | Record<string, { message?: string }>;
  trigger?: UseFormTrigger<FormValues>;
  setValue?: UseFormSetValue<FormValues>;
  watch?: UseFormWatch<FormValues>;
  file?: File | null;
  imageSrc: string | null;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectPicture?: () => void;
  uploadInputRef?: React.RefObject<HTMLInputElement | null>;
  countries: string[];
}

export const FormFields: React.FC<FormFieldsProps> = ({
  register,
  errors,
  trigger,
  setValue,
  watch,
  file,
  imageSrc,
  onFileChange,
  onSelectPicture,
  uploadInputRef,
  countries,
}) => {
  const renderPasswordStrength = () => {
    const password = watch ? watch('password') || '' : '';
    const strength = checkPasswordStrength(password);
    return (
      <div className={styles.strengthIndicator}>
        <div className={styles.strengthBar}>
          <div
            className={styles.strengthFill}
            style={{
              width: `${(strength.score / 5) * 100}%`,
              backgroundColor: strength.color,
            }}
          />
        </div>
        {password && (
          <span className={styles.strengthLabel} style={{ color: strength.color }}>
            {strength.label}
          </span>
        )}
      </div>
    );
  };
  const commonInputProps = (name: keyof FormValues, type: React.HTMLInputTypeAttribute | null) => ({
    id: name,
    label: name.charAt(0).toUpperCase() + name.slice(1),
    ...(type && { type }),
    error: errors?.[name]?.message,
    ...(type && type !== 'checkbox' && { showClearButton: true }),
    ...(type && type !== 'checkbox' && { fixedHeight: true }),
    ...(register ? register(name) : { name }),
    onBlur: register && trigger ? () => trigger(name) : undefined,
    ...(type &&
      type !== 'checkbox' && {
        onClear:
          trigger && setValue
            ? () => {
                setValue(name, '');
                trigger(name);
              }
            : undefined,
      }),
  });

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const countryOptions = countries.map((country) => ({
    value: country,
    label: country,
  }));

  return (
    <div className={styles.formContainer}>
      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <Input {...commonInputProps('name', 'text')} />
          <Input {...commonInputProps('email', 'email')} />
          <Input {...commonInputProps('age', 'number')} />
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.avatarSection}>
            <label htmlFor="picture">Upload Avatar</label>
            <input
              hidden
              type="file"
              id="picture"
              {...(register ? register('picture') : { name: 'picture' })}
              accept="image/jpeg, image/png"
              onChange={onFileChange}
              ref={uploadInputRef}
            />
            <Button
              type="button"
              variant="outlined"
              color="default"
              onClick={onSelectPicture}
              fullWidth
              size="small"
            >
              {file ? file.name : 'Select File'}
            </Button>
            {!errors?.picture && imageSrc && (
              <div className={styles.imagePreview}>
                <img src={imageSrc} alt="Preview" />
              </div>
            )}
            {errors?.picture && <p className={styles.error}>{errors.picture.message}</p>}
          </div>
        </div>
      </div>

      <div className={styles.rowWrapper}>
        <Select
          {...commonInputProps('gender', null)}
          options={genderOptions}
          autoComplete={false}
          fixedHeight={false}
          onChange={(value) => {
            if (register && trigger) {
              const event = { target: { value, name: 'gender' } };
              register('gender').onChange(event);
              trigger('gender');
            }
          }}
        />
        <Select
          {...commonInputProps('country', null)}
          options={countryOptions}
          autoComplete={true}
          fixedHeight={true}
          onChange={(value) => {
            if (register && trigger) {
              const event = { target: { value, name: 'country' } };
              register('country').onChange(event);
              trigger('country');
            }
          }}
        />
      </div>

      <div className={styles.rowWrapper}>
        <div className={styles.passwordField}>
          <Input {...commonInputProps('password', 'password')} />
          {renderPasswordStrength()}
        </div>
        <Input {...commonInputProps('confirmPassword', 'password')} label="Confirm Password" />
      </div>

      <div className={styles.checkboxWrapper}>
        <Checkbox
          {...commonInputProps('terms', 'checkbox')}
          label="Accept Terms and Conditions"
          fullWidth={false}
        />
      </div>
    </div>
  );
};
