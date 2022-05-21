import { arraycopy, hexStringToByte } from "@/Utils";
import NfcManager, { NfcTech, TagEvent } from "react-native-nfc-manager";

export class NFCReader {
  STATUS_CMD = [0x02, 0xa1 - 0x100, 0x07];
  nfcHandler: typeof NfcManager.nfcVHandler;

  nfcTech: NfcTech.NfcV;

  constructor() {
    this.nfcHandler = NfcManager.nfcVHandler;
    this.nfcTech = NfcTech.NfcV;
  }

  readTag = async (): Promise<TagEvent | null> => {
    try {
      // register for the NFC tag with nfcTech in it
      await NfcManager.requestTechnology(this.nfcTech);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      return tag;
    } catch (err) {
      const error = err as Error;
      throw new Error(error.message);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  };

  getMemoryData = (tag: TagEvent | null) => {
    if (!tag) return;
    const uid = hexStringToByte(tag.id);
    let resp;
    try {
      resp = this.nfcHandler.transceive(this.STATUS_CMD);
      return this.readout(uid, resp);
    } catch (err) {
      const error = err as Error;
      throw new Error(error.message);
    }
  };

  private readout = (uid: Uint8Array, resp: any): Array<number> => {
    let data: Array<number> = [];
    // Get bytes [i*8:(i+1)*8] from sensor memory and stores in data
    for (let i = 0; i <= 40; i++) {
      const cmd = [0x60, 0x20, 0, 0, 0, 0, 0, 0, 0, 0, i, 0];
      arraycopy(uid, 0, cmd, 2, 8);
      const time = new Date().getTime();
      while (true) {
        try {
          resp = this.nfcHandler.transceive(cmd);
          resp = resp.slice(2, resp.size);
          arraycopy(resp, 0, data, i * 8, resp.size);
          break;
        } catch (err) {
          const error = err as Error;
          if (new Date().getTime() > time + 1000 * 5) {
            throw new Error(
              "Timeout: took more than 5 seconds to read nfctag: " +
                error.message
            );
          }
        }
      }
    }
    return data;
  };
}
