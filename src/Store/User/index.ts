import { createSlice } from '@reduxjs/toolkit';
import { User } from '@/Services/modules/users';

const slice = createSlice({
  name: 'user',
  initialState: {} as User,
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
    },
  },
});

export const { setUser } = slice.actions;

export default slice.reducer;

type UserPayload = {
  payload: User;
};
