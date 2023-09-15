import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { EstimateFeeResponse, FireblocksSDK, InternalWalletAsset } from 'fireblocks-sdk';
import { config } from '@config/config';


const apiSecret = fs.readFileSync(process.cwd() + config.fireblocks.secretKeyPath, 'utf-8');
const apiKey = config.fireblocks.apiKey;
const apiEndpoint = config.fireblocks.endpoint;

export namespace FireblocksService {
	export const auth = () => new FireblocksSDK(apiSecret, apiKey, apiEndpoint);

	export const getFeeForAsset = async (sdk: FireblocksSDK, asset: string): Promise<EstimateFeeResponse> => {
		return sdk.getFeeForAsset(asset);
	};
}
