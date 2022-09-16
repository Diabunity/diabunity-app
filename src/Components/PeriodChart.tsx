import React from 'react';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const PeriodChart = ({ data }: { data: Array<any> }) => {
  return (
    <PieChart
      data={data}
      width={Dimensions.get('window').width} // from react-native
      chartConfig={{
        color: () => '#000',
        labelColor: () => '#000',
      }}
      height={100}
      accessor={'percentage'}
      backgroundColor={'transparent'}
      paddingLeft={'-80'}
      center={[30, 0]}
    />
  );
};

export default PeriodChart;
