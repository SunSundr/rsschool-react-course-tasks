import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { setFormData } from '~/store/formSlice';
import { RootState } from '~/store/store';
import { FormType, FormValues } from '~/types';
import { getBase64 } from '~/utils/getBase64';
import { schema } from '~/utils/schema';
import { Button } from '../Button/Button';
import { FormFields } from '../FormFields/FormFields';

interface HookFormProps {
  onClose: () => void;
}

export const HookForm = ({ onClose }: HookFormProps) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File>();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const { countries } = useSelector((state: RootState) => state.form);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const awaitFileChange = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    trigger,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (awaitFileChange.current) return;
    awaitFileChange.current = true;
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      setValue('picture', file);
      await trigger('picture');
      errors.picture ? setImageSrc(null) : setImageSrc((await getBase64(file)) as string);
    } else {
      setFile(undefined);
      setImageSrc(null);
      trigger('picture');
    }
    awaitFileChange.current = false;
  };

  const onSelectPicture = () => {
    if (!uploadInputRef.current) return;
    uploadInputRef.current.files = null;
    uploadInputRef.current.value = '';
    setValue('picture', null);
    const handleWindowClick = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const clearFileData = () => {
        setFile(undefined);
        setImageSrc(null);
        trigger('picture');
      };
      let counter = 0;
      const awaitFileChangeTimer = setInterval(() => {
        counter++;
        if (counter >= 20) {
          clearInterval(awaitFileChangeTimer);
          clearFileData();
          return;
        }
        if (!awaitFileChange.current) {
          clearInterval(awaitFileChangeTimer);
          if (
            uploadInputRef.current &&
            (!uploadInputRef.current.files || uploadInputRef.current.files.length === 0)
          ) {
            clearFileData();
          }
        }
      }, 50);
      window.removeEventListener('focus', handleWindowClick);
    };
    uploadInputRef.current?.click();
    setTimeout(() => window.addEventListener('focus', handleWindowClick), 10);
  };

  const onSubmit = (data: FormValues) => {
    dispatch(
      setFormData({
        type: FormType.hook,
        data: {
          ...data,
          picture: imageSrc,
          gender: data.gender === 'male' ? 'Male' : 'Female',
        },
      }),
    );

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormFields
        register={register}
        errors={errors}
        trigger={trigger}
        setValue={setValue}
        watch={watch}
        file={file}
        imageSrc={imageSrc}
        onFileChange={onFileChange}
        onSelectPicture={onSelectPicture}
        uploadInputRef={uploadInputRef}
        countries={countries}
      />

      <div className="actions">
        <Button
          type="button"
          variant="contained"
          disabled={isSubmitting}
          onClick={onClose}
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
          disabled={!isValid || isSubmitting}
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
