import React from 'react';
import { View } from 'react-native-ui-lib';
import { useTheme } from '@/Hooks';
import { DatePeriod, getDatePeriod } from '@/Utils';
import DatePicker from 'react-native-date-ranges';
import moment from 'moment';

import { styles } from './styles';
import { StyleSheet } from 'react-native';

const headerStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    marginTop: 15,
    borderRadius: 3,
    borderWidth: 0.5,
    ...styles.dropShadow,
  },
  font: {
    fontSize: 16,
  },
});

export default ({ onDateChange }: { onDateChange: Function }) => {
  const { Colors } = useTheme();
  const dateFormat = 'DD ' + '\\d\\e ' + 'MMMM' + ', YYYY';
  const placeHolder = {
    startDate: moment(getDatePeriod(new Date(), DatePeriod.LAST_WEEK)).format(
      dateFormat
    ),
    endDate: moment(new Date()).format(dateFormat),
  };

  return (
    <View
      style={{
        ...headerStyles.container,
        borderColor: Colors.gray,
        backgroundColor: Colors.white,
      }}
    >
      <DatePicker
        style={{ height: 32, borderWidth: 0 }}
        customStyles={{
          placeholderText: headerStyles.font,
          headerStyle: { backgroundColor: Colors.red },
          headerDateTitle: headerStyles.font,
          contentText: headerStyles.font,
        }}
        placeholder={`${placeHolder.startDate} → ${placeHolder.endDate}`}
        outFormat={dateFormat}
        headFormat={dateFormat}
        selectedBgColor={Colors.red}
        mode={'range'}
        ButtonText="Seleccionar"
        ButtonStyle={{}}
        markText=" "
        clearStart="Desde"
        clearEnd="Hasta"
        onConfirm={(data: { startDate: string; endDate: string }) => {
          onDateChange({
            from: data.startDate.replaceAll('/', ''),
            to: data.endDate.replaceAll('/', ''),
          });
        }}
      />
    </View>
  );
};
