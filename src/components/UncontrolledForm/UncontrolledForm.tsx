import { useRef, useState } from 'react';
import { UseFormWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { FormType, FormValues } from '~/types';
import { schema } from '~/utils/schema';
import { setFormData } from '../../store/formSlice';
import { RootState } from '../../store/store';
import { getBase64 } from '../../utils/getBase64';
import { Button } from '../Button/Button';
import { FormFields } from '../FormFields/FormFields';

interface UncontrolledFormProps {
  onClose: () => void;
}

export const UncontrolledForm = ({ onClose }: UncontrolledFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useDispatch();
  const { countries } = useSelector((state: RootState) => state.form);
  const [errors, setErrors] = useState<Record<string, { message?: string }>>({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const [file, setFile] = useState<File>();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const mockWatch = ((fieldName: keyof FormValues) => {
    if (fieldName === 'password' && showPasswordStrength) {
      return currentPassword;
    }
    return '';
  }) as UseFormWatch<FormValues>;

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      setImageSrc((await getBase64(file)) as string);
    } else {
      setFile(undefined);
      setImageSrc(null);
    }
  };

  const onCancel = () => {
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) {
      console.error('Form reference is null');
      return;
    }

    const formData = new FormData(formRef.current);
    const data: FormValues = {
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      gender: formData.get('gender') as string,
      terms: formData.get('terms') === 'on',
      picture: formData.get('picture') as File,
      country: formData.get('country') as string,
    };

    setCurrentPassword(data.password);
    setShowPasswordStrength(true);

    try {
      await schema.validate(data, { abortEarly: false });
      dispatch(
        setFormData({
          type: FormType.uncontrolled,
          data: { ...data, picture: imageSrc },
        }),
      );
      setErrors({});
      onClose();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: Record<string, { message: string }> = {};
        err.inner.forEach((error) => {
          if (error.path) validationErrors[error.path] = { message: error.message };
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <FormFields
        errors={errors}
        watch={showPasswordStrength ? mockWatch : undefined}
        file={file}
        imageSrc={imageSrc}
        onFileChange={onFileChange}
        onSelectPicture={() => uploadInputRef.current?.click()}
        uploadInputRef={uploadInputRef}
        countries={countries}
      />

      <div className="actions">
        <Button
          type="button"
          variant="contained"
          onClick={onCancel}
          color="warn"
          size="medium"
          {...{ style: { minWidth: '160px' } }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="default"
          size="medium"
          fullWidth
          {...{ style: { minWidth: '160px' } }}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};
