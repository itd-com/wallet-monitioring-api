import { User } from '@domain/account/models/users';
import { FeeSysHistory } from '@domain/feeSys/models/feeSysHistories';

export namespace FeeSysTransformer {
    export namespace createFeeSysToEWalletTxn {
        export type Request = {
            reqUser: User.apiT,
            param: {
                amount: string,
                note?: string,
            },
            data: FeeSysHistory.storeT;
        };

        export type ResponseData = FeeSysHistory.T;
    }
}