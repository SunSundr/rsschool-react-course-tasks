export enum FormType {
  uncontrolled = 'uncontrolled',
  hook = 'hook',
}

export interface FormValues {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  terms: boolean;
  picture: File | null;
  country: string;
  type?: FormType;
}

export type StateValues = Omit<FormValues, 'picture'> & {
  picture: string | null;
};

export interface FormState {
  uncontrolledFormData: StateValues | null;
  hookFormData: StateValues | null;
  formHistory: StateValues[];
  newEntryId: number | null;
  countries: string[];
  errors: Record<string, { message: string }>;
}
