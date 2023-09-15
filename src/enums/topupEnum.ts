export enum TopupTypeEnum {
    TRUEMONEY = 'TRUEMONEY',
    E_WALLET = 'E_WALLET',
}

export enum TopupBillerIdEnum {
    TRUEMONEY = '8',
    E_WALLET = '14',
}

export const getTopupBillerId = (t: TopupTypeEnum): TopupBillerIdEnum => {
    return TopupBillerIdEnum[t];
};

export enum TopupStatusEnum {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    TIMEOUT = 'TIMEOUT',
    REJECT = 'REJECT',
}