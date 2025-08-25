import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormState, FormType, StateValues } from '../types';
import countries from '../utils/countries.json';

const initialState: FormState = {
  uncontrolledFormData: null,
  hookFormData: null,
  formHistory: [],
  newEntryId: null,
  countries: countries,
  errors: {},
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<{ type: FormType; data: StateValues }>) => {
      const { type, data } = action.payload;

      const newEntry = {
        ...data,
        type,
        timestamp: Date.now(),
      };
      state.formHistory.push(newEntry);

      state.newEntryId = state.formHistory.length - 1;

      if (type === FormType.uncontrolled) {
        state.uncontrolledFormData = data;
      } else if (type === FormType.hook) {
        state.hookFormData = data;
      }
    },

    clearNewEntryId: (state) => {
      state.newEntryId = null;
    },
  },
});

export const { setFormData, clearNewEntryId } = formSlice.actions;

export default formSlice.reducer;
