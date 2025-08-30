import { useState } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';
import { FormValues } from '~/types';
import { checkPasswordStrength } from '~/utils/passwordStrength';
import Avatar from '../../assets/avatar.svg?react';
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
  const [dragHover, setDragHover] = useState(false);
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
    onBlur: type && register && trigger ? () => trigger(name) : undefined,
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
    { value: 'other', label: 'Other' },
  ];

  const countryOptions = countries.map((country) => ({
    value: country,
    label: country,
  }));

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length === 1) {
      onFileChange?.({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
      if (trigger) {
        trigger('picture');
      } else if (uploadInputRef?.current) {
        uploadInputRef.current.files = files;
        uploadInputRef.current.value = files[0].name;
      }
    }
  };

  const handleDropClear = () => {
    onFileChange?.({ target: { files: null } } as React.ChangeEvent<HTMLInputElement>);
    if (trigger) {
      trigger('picture');
    } else if (uploadInputRef?.current) {
      uploadInputRef.current.files = null;
      uploadInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragHover(true);
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragHover(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragHover(false);
  };

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
              ref={uploadInputRef}
              accept="image/jpeg, image/png"
              onChange={onFileChange}
            />
            <Button
              type="button"
              variant="outlined"
              color={errors?.picture ? 'error' : 'default'}
              onClick={onSelectPicture}
              fullWidth
              size="small"
            >
              {file ? file.name : 'Select File'}
            </Button>

            {imageSrc && !errors?.picture ? (
              <div
                className={styles.imagePreview}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDropClear}
              >
                <img src={imageSrc} alt="Preview" />
              </div>
            ) : (
              <div
                className={`${styles.imagePreview} ${dragHover ? styles.dragHover : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
              >
                <div className={styles.avatarWrapper}>
                  <Avatar className={styles.avatar} />
                  <span>
                    Drag and Drop image file
                    <br />
                    here
                  </span>
                </div>
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
          <Input {...commonInputProps('password', 'password')} autoComplete="off" />
          {renderPasswordStrength()}
        </div>
        <Input
          {...commonInputProps('confirmPassword', 'password')}
          label="Confirm Password"
          autoComplete="off"
        />
      </div>

      <div className={styles.checkboxWrapper}>
        <Checkbox
          {...commonInputProps('terms', 'checkbox')}
          label="Accept Terms and Conditions"
          fullWidth={false}
          fixedHeight={true}
        />
      </div>
    </div>
  );
};
