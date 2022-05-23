import { arraycopy, hexToBytes } from "@/Utils";
import { Alert, Platform } from "react-native";
import NfcManager, {
  NfcError,
  NfcTech,
  TagEvent,
} from "react-native-nfc-manager";
import { setShowNfcPrompt } from "@/Store/Theme";
import { store } from "@/Store";

const withAndroidPrompt = (fn: any, noClose?: any) => {
  async function wrapper() {
    try {
      if (Platform.OS === "android") {
        store.dispatch(setShowNfcPrompt({ showNfcPrompt: true }));
      }

      return await fn.apply(null, arguments);
    } catch (ex) {
      throw ex;
    } finally {
      if (Platform.OS === "android" && !noClose) {
        store.dispatch(setShowNfcPrompt({ showNfcPrompt: false }));
      }
    }
  }

  return wrapper;
};

export class NFCReader {
  STATUS_CMD = [0x02, 0xa1 - 0x100, 0x07];
  nfcHandler: typeof NfcManager.nfcVHandler;

  nfcTech: NfcTech.NfcV;

  constructor() {
    this.nfcHandler = NfcManager.nfcVHandler;
    this.nfcTech = NfcTech.NfcV;
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

  getGlucoseData = withAndroidPrompt(
    async (): Promise<Array<number> | null | void> => {
      try {
        // register for the NFC tag with nfcTech in it
        await NfcManager.requestTechnology([this.nfcTech]);
        // the resolved tag object will contain `ndefMessage` property
        const tag = await NfcManager.getTag();
        return this.getMemory(tag);
      } catch (ex) {
        this.handleException(ex);
      } finally {
        // stop the nfc scanning
        this._cleanUp();
      }
    }
  );

  private getMemory = async (
    tag: TagEvent | null
  ): Promise<Array<number> | void> => {
    if (!tag) return;
    const uid = hexToBytes(tag.id);
    let resp: Array<number>;
    try {
      resp = await this.nfcHandler.transceive(this.STATUS_CMD);
      return this.readout(uid, resp);
    } catch (ex) {
      this.handleException(ex);
    }
  };

  private readout = async (
    uid: Array<number>,
    resp: Array<number>
  ): Promise<Array<number>> => {
    let data: Array<number> = [];
    // Get bytes [i*8:(i+1)*8] from sensor memory and stores in data
    for (let i = 0; i <= 40; i++) {
      const cmd = [0x60, 0x20, 0, 0, 0, 0, 0, 0, 0, 0, i, 0];
      arraycopy(uid, 0, cmd, 2, 8);
      const time = new Date().getTime();
      while (true) {
        try {
          resp = await this.nfcHandler.transceive(cmd);
          resp = resp.slice(2, resp.length);
          arraycopy(resp, 0, data, i * 8, resp.length);
          break;
        } catch (ex) {
          if (new Date().getTime() > time + 1000 * 5) {
            this.handleException(ex);
          }
        }
      }
    }
    return data;
  };

  handleException = (ex: any) => {
    if (ex instanceof NfcError.UserCancel) {
      // bypass
    } else if (ex instanceof NfcError.Timeout) {
      Alert.alert("NFC Session Timeout");
    } else {
      console.warn(ex);
      if (Platform.OS === "ios") {
        NfcManager.invalidateSessionWithErrorIOS(`${ex}`);
      } else {
        Alert.alert("NFC Error", `${ex}`);
      }
    }
  };
}
