import { createSlice } from '@reduxjs/toolkit';
import { Metadata, User } from '@/Services/modules/users';
import { convertToCamelCase } from '@/Utils';
import { DEFAULT_SUBSCRIPTION } from '@/Constants';

const initialState = {} as User;
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }: UserPayload) => {
      state.diabetes_type = payload.diabetes_type;
      state.birth_date = payload.birth_date;
      state.on_boarding = payload.on_boarding;
      state.weight = payload.weight;
      state.height = payload.height;
      state.glucose_min = payload.glucose_min;
      state.glucose_max = payload.glucose_max;
      state.verified = payload.verified;
      state.subscription = payload.subscription
        ? {
            ...payload.subscription,
            metadata: convertToCamelCase(
              payload.subscription?.metadata as Metadata[]
            ),
          }
        : DEFAULT_SUBSCRIPTION;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = slice.actions;

export default slice.reducer;

type UserPayload = {
  payload: User;
};
