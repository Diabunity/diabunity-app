import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/Hooks';
import { LineChart } from 'react-native-chart-kit';
import { NFCReader } from '@/Services/modules/nfc';
import Clipboard from '@react-native-community/clipboard';

import Table, { TableBuilder, TENDENCY } from './Table';

const HomeContainer = () => {
  const { Common, Fonts, Gutters, Layout } = useTheme();
  const [nfcInstance, setNFCInstance] = useState<NFCReader>();
  const [isScanning, setIsScanning] = useState(false);
  const [currentDot, setCurrentDot] = useState<number | null>(null);

  const onDataPointClick = (data: any) => {
    setCurrentDot(data.value);
    setTimeout(() => {
      setCurrentDot(null);
    }, 1500);
  };

  useEffect(() => {
    const init = async () => {
      const NFCObj = new NFCReader();
      const supported = await NFCObj.init();
      if (!supported) {
        // Alert.alert('NFC is not supported');
      } else {
        setNFCInstance(NFCObj);
      }
    };
    init();
  }, []);

  const onTag = async () => {
    if (!nfcInstance || isScanning) {
      return;
    }
    setIsScanning(true);
    const glucoseData = await nfcInstance.getGlucoseData();
    setIsScanning(false);
    if (glucoseData) {
      Clipboard.setString(glucoseData.toString());
      Alert.alert('Glucose data copied to Clipboard!');
    }
  };

  return (
    <ScrollView
      style={Layout.fill}
      contentContainerStyle={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          lineHeight: 24,
          width: '100%',
          textAlign: 'center',
          borderBottomColor: 'rgba(0, 0, 0, 0.12)',
          borderBottomWidth: 1,
        }}
      >
        Últimas 24 horas
      </Text>
      <LineChart
        data={{
          labels: ['15:00', '15:37', '16:04', '16:21', '17:40', '18:04'],
          datasets: [
            {
              data: [93, 110, 124, 140, 121, 89],
            },
          ],
        }}
        width={Dimensions.get('window').width - 40} // from react-native
        height={202}
        yAxisSuffix="mg/dL"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        onDataPointClick={(data) => onDataPointClick(data)}
        style={{
          marginVertical: 8,
        }}
      />
      <Table
        tendency={TENDENCY.UP}
        // TODO : All these values should be fetched from the API/LocalStorage
        data={new TableBuilder()
          .periodInTarget(45)
          .lastScanMeasure(76)
          .average(134)
          .sensorLife(4)
          .build()}
      />
      <Text style={{ color: 'black', fontSize: 20 }}>{currentDot}</Text>
      <TouchableOpacity
        style={[Common.button.rounded, Gutters.regularBMargin, { height: 50 }]}
        onPress={onTag}
        disabled={isScanning}
        activeOpacity={!isScanning ? 0.5 : 1}
      >
        <Text style={Fonts.textRegular}>Medir Glucosa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeContainer;
