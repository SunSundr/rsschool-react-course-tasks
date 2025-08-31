import { ChangeEvent } from 'react';

export const FormFieldsMock = ({
  onFileChange,
  onSelectPicture,
  uploadInputRef,
  handleDrop,
  handleDropClear,
  imageSrc,
}: {
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectPicture: () => void;
  uploadInputRef: React.RefObject<HTMLInputElement | null> | undefined;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDropClear?: () => void;
  imageSrc: string | null;
}) => (
  <div data-testid="form-fields">
    <input name="name" data-testid="name-input" />
    <input name="email" data-testid="email-input" />
    <input name="age" data-testid="age-input" />
    <input name="password" data-testid="password-input" />
    <input name="confirmPassword" data-testid="confirm-password-input" />
    <input name="gender" data-testid="gender-input" />
    <input name="country" data-testid="country-input" />
    <input name="terms" type="checkbox" data-testid="terms-input" />
    <div data-testid="drop-zone" onDrop={handleDrop} onDragEnd={handleDropClear}></div>
    <input name="picture" type="file" data-testid="file-input" onChange={onFileChange} />
    {imageSrc && <img src={imageSrc} data-testid="image-preview" />}
    <input
      hidden
      type="file"
      id="picture"
      accept="image/jpeg, image/png"
      onChange={onFileChange}
      ref={uploadInputRef}
    />
    <button type="button" onClick={onSelectPicture} data-testid="select-picture">
      Select Picture
    </button>
  </div>
);
