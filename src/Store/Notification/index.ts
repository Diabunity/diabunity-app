import { Incubator } from 'react-native-ui-lib';
import { Colors } from '@/Theme/Variables';
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'notification',
  initialState: {
    preset: Incubator.ToastPresets.SUCCESS,
    message: '',
    color: '',
  } as NotificationState,
  reducers: {
    setNotification: (
      state,
      { payload: { preset, message } }: NotificationPayload
    ) => {
      state.visible = true;
      state.preset = preset;
      state.message = message;
      state.color =
        preset === Incubator.ToastPresets.SUCCESS
          ? Colors.success
          : Colors.error;
    },
    toggleNotification: (
      state,
      { payload: { visible } }: { payload: { visible: boolean } }
    ) => {
      state.visible = visible;
    },
  },
});

export const { setNotification, toggleNotification } = slice.actions;

export default slice.reducer;

export type NotificationState = {
  visible: boolean;
  preset: Incubator.ToastPresets;
  message: string;
  color: string;
};

type NotificationPayload = {
  payload: {
    preset: Incubator.ToastPresets;
    message: string;
    visible?: boolean;
  };
};
