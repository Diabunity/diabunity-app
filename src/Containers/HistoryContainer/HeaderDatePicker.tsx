import React from 'react';
import { View } from 'react-native-ui-lib';
import DatePicker from 'react-native-date-ranges';
import moment from 'moment';
import 'moment/locale/es';
import { useTheme } from '@/Hooks';
import { DatePeriod, getDatePeriod } from '@/Utils';
import { headerStyles as styles } from './styles';

moment.locale('es');

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
        ...styles.container,
        borderColor: Colors.gray,
        backgroundColor: Colors.white,
      }}
    >
      <DatePicker
        style={{ borderWidth: 0 }}
        customStyles={{
          placeholderText: styles.font,
          headerStyle: { backgroundColor: Colors.red },
          headerDateTitle: styles.font,
          contentText: styles.font,
        }}
        placeholder={`${placeHolder.startDate} \u27a9 ${placeHolder.endDate}`}
        outFormat={dateFormat}
        headFormat={dateFormat}
        selectedBgColor={Colors.red}
        mode={'range'}
        ButtonText="Seleccionar"
        ButtonStyle={{}}
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
