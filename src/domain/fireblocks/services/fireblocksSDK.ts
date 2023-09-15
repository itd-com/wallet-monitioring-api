import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { EstimateFeeResponse, FireblocksSDK, InternalWalletAsset } from 'fireblocks-sdk';
import { config } from '@config/config';


const keyPath = path.resolve(__dirname, config.fireblocks.secretKeyPath);
const apiSecret = config.fireblocks.secretKeyPath === '' || !fs.existsSync(keyPath) ? '' : fs.readFileSync(keyPath, 'utf8');
const apiKey = config.fireblocks.apiKey;
const apiEndpoint = config.fireblocks.endpoint;

export namespace FireblocksSDKService {
    export const auth = new FireblocksSDK(apiSecret, apiKey, apiEndpoint);

    export const getFeeForAsset = (sdk: FireblocksSDK, asset: string): Promise<EstimateFeeResponse> => {
        return sdk.getFeeForAsset(asset);
    };

}