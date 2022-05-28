import { arraycopy, hexToBytes, uncomplement } from "@/Utils";
import { Alert, Platform } from "react-native";
import NfcManager, {
  NfcError,
  NfcTech,
  TagEvent,
} from "react-native-nfc-manager";
import { setShowNfcPrompt } from "@/Store/Theme";
import { store } from "@/Store";

export class NFCReader {
  STATUS_CMD = [0x02, 0xa1 - 0x100, 0x07];
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

  getGlucoseData = async (): Promise<Array<number> | null> => {
    try {
      if (Platform.OS === "android") {
        store.dispatch(setShowNfcPrompt({ showNfcPrompt: true }));
      }
      // register for the NFC tag with nfcTech in it
      await NfcManager.requestTechnology(this.nfcTech);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      return await this.getMemory(tag);
    } catch (ex) {
      this.handleException(ex);
      return null;
    } finally {
      if (Platform.OS === "android") {
        store.dispatch(setShowNfcPrompt({ showNfcPrompt: false }));
      }
      // stop the nfc scanning
      this._cleanUp();
    }
  };

  private getMemory = async (
    tag: TagEvent | null
  ): Promise<Array<number> | null> => {
    if (!tag) return null;
    const uid = hexToBytes(tag.id);
    let resp: Array<number>;
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
              `Timeout: took more than 5 seconds to read nfctag - ${ex}`
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

  // [-42, 97, 16, 25, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -94, -87, 0, 10, 48, 6, -56, -104, -101, 0, 37, 6, -56, -108, -101, 0, 25, 6, -56, -112, -101, 0, 15, 6, -56, -116, -101, 0, 8, 6, -56, -116, -101, 0, 0, 6, -56, -116, -37, 0, -13, 5, -120, 126, -37, 0, -34, 5, -120, -14, -38, 0, -28, 5, -56, 56, -37, 0, -27, 5, -56, 64, -37, 0, -31, 5, -56, 92, -37, 0, -42, 5, -56, 96, -37, 0, +260 more]

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
