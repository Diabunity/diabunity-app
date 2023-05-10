import React from 'react';
import moment from 'moment';
import { View, Platform, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { Incubator } from 'react-native-ui-lib';
// @ts-ignore
import Handlebars from 'react-native-handlebars/dist/handlebars';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorParams } from '@/Navigators/Application';
import { useTheme } from '@/Hooks';
import { store } from '@/Store';
import { setNotification } from '@/Store/Notification';
import { BackButton } from '@/Components';
import { DatePeriod } from '@/Utils';
// @ts-ignore
import reportTemplate from '@/Templates/report.html';
import mockReportData from '@/Mocks/reports';
import { ANDROID_REPORT_WEBVIEW_DATA, base64Logo } from '@/Constants';
import { handleReportData } from '@/Utils/reports';

// Custom helper: isSame
Handlebars.registerHelper('isSame', function (a: any, b: any): boolean {
  return a === b;
});

// Custom helper: isLast
Handlebars.registerHelper(
  'isLast',
  function (index: number, array: any[]): boolean {
    return index === array.length - 1;
  }
);

type Props = NativeStackScreenProps<NavigatorParams> & {
  route: RouteProp<
    {
      params?: {
        filter: DatePeriod;
      };
    },
    'params'
  >;
};

const getInjectableJSMessage = (message: unknown) =>
  `
    (function() {
      document.dispatchEvent(new MessageEvent('message', {
        data: ${JSON.stringify(message)}
      }));
    })();
  `;

const MedicalReportContainer = ({
  route,
  navigation: { goBack, canGoBack },
}: Props) => {
  const { Layout, Images } = useTheme();
  const reportData = mockReportData;
  const webViewRef = React.useRef(null);
  const { filter } = route?.params || { filter: DatePeriod.LAST_DAY };
  const webViewSource =
    Platform.OS === 'ios'
      ? require('@/Templates/webviews/charts.html')
      : ANDROID_REPORT_WEBVIEW_DATA;

  const handleCapture = async (data: any) => {
    const today = moment(new Date());
    const processedData = handleReportData(reportData, filter);
    const template = Handlebars.compile(reportTemplate);

    const options = {
      html: template({
        rangeChartData: data.images.range,
        lineChartData: data.images.line,
        measurementTimestamps:
          processedData.user_info.measurements_info.results.map(
            (r: any) => r.timestamp
          ),
        user_info: processedData.user_info,
        logo: base64Logo,
        type: processedData.type[1],
        title: `Reporte ${processedData.type[0]}: ${processedData.dateRange}`,
      }),
      fileName: `reporte-medico-${today.format('DD-MM-YYYY')}`,
      directory: Platform.OS === 'ios' ? 'Documents' : 'Downloads',
      height: 842,
      width: 595,
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      if (file.filePath) {
        await FileViewer.open(file.filePath, {
          showOpenWithDialog: true,
          displayName: 'Diabunity - Reporte médico',
        });
      }
    } catch {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: 'Hubo un error al generar el reporte.',
        })
      );
    }
  };
  const onMessageReceived = async (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    await handleCapture(data);
  };
  const sendDataToWebView = () => {
    const processedData = handleReportData(reportData, filter);
    //@ts-ignore
    webViewRef.current?.injectJavaScript(getInjectableJSMessage(processedData));
  };

  return (
    <View style={[Layout.fill]}>
      <BackButton goBack={goBack} canGoBack={canGoBack} />
      <View style={[Layout.fill]}>
        <View style={[Layout.rowCenter, Layout.alignItemsCenter]}>
          <Image source={Images.logoType} />
        </View>
        <WebView
          ref={webViewRef}
          scalesPageToFit
          onLoadEnd={sendDataToWebView}
          bounces={false}
          startInLoadingState
          originWhitelist={['*']}
          onMessage={onMessageReceived}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          source={webViewSource}
          style={{ marginTop: 10, flex: 1 }}
        />
      </View>
    </View>
  );
};

export default MedicalReportContainer;
