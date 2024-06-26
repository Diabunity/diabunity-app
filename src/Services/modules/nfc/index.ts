import crashlytics from '@react-native-firebase/crashlytics';
import { arraycopy, hexToBytes, uncomplement } from '@/Utils';
import { Alert, Platform } from 'react-native';
import LibreManagerTool from 'react-native-libre-manager/src';
import NfcManager, {
  NfcError,
  NfcTech,
  TagEvent,
} from 'react-native-nfc-manager';
import { setShowNfcPrompt } from '@/Store/Theme';
import { store } from '@/Store';

export enum SensorLifeStatus {
  UNKNOWN = 0,
  EXPIRED = 1,
  ABOUT_TO_EXPIRE = 2,
  GOOD = 3,
  ALMOST_NEW = 4,
}

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
export class NFCReader {
  STATUS_CMD = [0x02, 0xa1 - 0x100, 0x07];
  ACTIVATE_CMD = [0x02, 0xa0, 0x07, 0xc2, 0xad, 0x75, 0x21];
  nfcHandler: typeof NfcManager.nfcVHandler;

  nfcTech: Array<NfcTech>;

  constructor() {
    this.nfcHandler = NfcManager.nfcVHandler;
    this.nfcTech = [NfcTech.NfcV, NfcTech.NdefFormatable];
  }

  init = async () => {
    const supported = await NfcManager.isSupported();
    if (supported) {
      await NfcManager.start();
    }
    return supported;
  };

  _cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  };

  getSensorLife = async (): Promise<number | undefined> => {
    const MAX_LIFE = 14;
    const { sensorLife } = await new Promise((resolve) =>
      LibreManagerTool.getSensorInfo((resp) => resolve(resp))
    );
    const age = sensorLife && Math.trunc(MAX_LIFE - sensorLife / 60 / 24);
    return age;
  };

  getGlucoseData = async (): Promise<Array<number> | null | any> => {
    if (Platform.OS === 'ios') {
      //If iOS we get the data from the react-native-libre-manager library
      const glucoseInfo = (await new Promise((resolve) =>
        LibreManagerTool.getGlucoseHistory((resp: unknown) => resolve(resp))
      )) as Promise<any>;
      await sleep(4000);
      const sensorLife = await this.getSensorLife();
      return { ...glucoseInfo, sensorLife };
    } else {
      try {
        store.dispatch(setShowNfcPrompt({ showNfcPrompt: true }));
        // register for the NFC tag with nfcTech in it
        await NfcManager.requestTechnology(this.nfcTech);
        // the resolved tag object will contain `ndefMessage` property
        const tag = await NfcManager.getTag();
        const memoryData = await this.getMemory(tag);
        const glucoseInfo = await LibreManagerTool.getGlucoseHistoryAndroid(
          tag?.id,
          memoryData
        );
        const { sensorLife } = await LibreManagerTool.getSensorInfoAndroid(
          memoryData
        );
        return { ...glucoseInfo, sensorLife };
      } catch (ex) {
        this.handleException(ex);
        return null;
      } finally {
        store.dispatch(setShowNfcPrompt({ showNfcPrompt: false }));
        // stop the nfc scanning
        this._cleanUp();
      }
    }
  };

  private getMemory = async (
    tag: TagEvent | null
  ): Promise<Array<number> | null> => {
    if (!tag) {
      return null;
    }
    const uid = hexToBytes(tag.id);
    let resp: Array<number>;
    try {
      await this.nfcHandler.transceive(this.ACTIVATE_CMD);
    } catch {
      /*mask error*/
    }
    resp = await this.nfcHandler.transceive(this.STATUS_CMD);
    return this.readout(uid, resp);
  };

  private readout = async (
    uid: Array<number>,
    resp: Array<number>
  ): Promise<Array<number> | null> => {
    let data: Array<number> = [];
    // Get bytes [i*8:(i+1)*8] from sensor memory and stores in data
    for (let i = 0; i <= 40; i++) {
      const cmd = [0x60, 0x20, 0, 0, 0, 0, 0, 0, 0, 0, i, 0];
      arraycopy(uid, 0, cmd, 2, 8);
      const time = new Date().getTime();
      while (true) {
        try {
          resp = await this.nfcHandler.transceive(cmd);
          resp = resp.map((value) => uncomplement(value, 8));
          resp = resp.slice(2, resp.length);
          arraycopy(resp, 0, data, i * 8, resp.length);
          break;
        } catch (ex) {
          const FIVE_SECONDS = 5000;
          if (new Date().getTime() > time + FIVE_SECONDS) {
            this.handleException(
              'No se pudo leer el parche. Intente nuevamente'
            );
            return null;
          }
        }
      }
    }

    for (let i = data.length; i < 360; i++) {
      data.push(0);
    }

    return data;
  };

  handleException = (ex: any) => {
    if (ex instanceof NfcError.UserCancel) {
      // bypass
    } else if (ex instanceof NfcError.Timeout) {
      crashlytics().recordError(ex, 'Timeout trying to readout');
      Alert.alert('No se pudo leer el parche. Intente nuevamente');
    } else {
      crashlytics().recordError(ex, 'Error trying to readout');
      console.warn(ex);
      if (Platform.OS === 'ios') {
        NfcManager.invalidateSessionWithErrorIOS(`${ex}`);
      } else {
        Alert.alert('Error al leer el parche:', `${ex}`);
      }
    }
  };
}
