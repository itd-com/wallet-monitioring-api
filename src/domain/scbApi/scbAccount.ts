import axios, { AxiosResponse } from 'axios';

export class ScbAccount {
    config: Iconfig;
    constructor(config: Iconfig) {
        this.config = config;
    }

    public sleep(ms: number) {
        // eslint-disable-next-line no-promise-executor-return
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public getHeaders() {
        return {
            Host: 'fasteasy.scbeasy.com:8443',
            'scb-channel': 'APP',
            'Accept-Language': 'th',
            'User-Agent': this.config.userAgent,
            Connection: 'Keep-Alive',
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/json; charset=UTF-8',
            Accept: '*/*',
        };
    }

    public async preloadandresumecheck() {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v3/login/preloadandresumecheck`,
            data: JSON.stringify({
                isLoadGeneralConsent: '1',
                deviceId: this.config.deviceId,
                jailbreak: '0',
                tilesVersion: this.config.tilesVersion,
                userMode: 'INDIVIDUAL',
            }),
            headers: { ...this.getHeaders() },
        }).catch((error) => {
            return error.response;
        });
        return r;
    }

    public async preAuth(mode: string = 'PseudoFE') {
        const r: IScbResponse<IScbResponseStatusPseudoFE> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/isprint/soap/preAuth`,
            data: JSON.stringify({
                loginModuleId: mode,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => {
            return error.response;
        });

        return r;
    }

    public async encryptPin(pseudoSid: string, pseudoPubKey: string, pseudoRandom: string, pin: string, pseudoOaepHashAlgo: string) {
        const r: AxiosResponse = await axios({
            method: 'post',
            url: `${this.config.pinencrypt}`,
            data: JSON.stringify({
                Sid: pseudoSid,
                pubKey: pseudoPubKey,
                ServerRandom: pseudoRandom,
                pin,
                pseudoOaepHashAlgo,
            }),
            headers: { ...this.getHeaders() },
        }).catch((error) => {
            return error.response;
        });
        return r.data as string;
    }


    public async loginReq(pseudoPin: string, pseudoSid: string) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v1/fasteasy-login`,
            data: JSON.stringify({
                deviceId: this.config.deviceId,
                pseudoPin,
                pseudoSid,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuthRefresh },
        }).catch((error) => {
            return error.response;
        });
        return r;
    }

    public async login() {
        const preloadandresumecheck = await this.preloadandresumecheck();
        if (preloadandresumecheck?.status != 200) return;
        if (preloadandresumecheck?.data?.status?.code != 1000) return;
        this.config.apiAuthRefresh = preloadandresumecheck.headers['api-auth'];
        const preAuth = await this.preAuth('PseudoFE');
        if (preAuth?.status != 200) return;
        if (preAuth?.data?.status?.statuscode != '0') return;
        const e2ee = preAuth.data.e2ee;
        if (!e2ee) return;
        const pseudoPin = await this.encryptPin(e2ee.pseudoSid, e2ee.pseudoPubKey, e2ee.pseudoRandom, this.config.pin, e2ee.pseudoOaepHashAlgo);
        // let pseudoPin = ame2ee.encryptPinForAM(e2ee.pseudoSid, e2ee.pseudoPubKey, e2ee.pseudoRandom, this.config.pin, e2ee.pseudoOaepHashAlgo)
        const fasteasy_login = await this.loginReq(pseudoPin, e2ee.pseudoSid);
        // console.log(fasteasy_login.data)
        if (fasteasy_login.status != 200) return;
        if (fasteasy_login.data.status.code != 1000) return;
        // this.config.apiAuth = fasteasy_login.headers['api-auth'];
        // eslint-disable-next-line consistent-return
        return fasteasy_login.headers['api-auth'];
    }


    public async getAccounts() {
        const r: IScbResponsegetAccounts = await axios({
            method: 'get',
            url: `${this.config.scbGateway}/v3/profiles/accounts/registered?tilesVersion=${this.config.tilesVersion}`,
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async getPromptpay() {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'get',
            url: `${this.config.scbGateway}/v4/profiles/promptpay`,
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async getQuickBalance() {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'get',
            url: `${this.config.scbGateway}/v1/profiles/quickbalance`,
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async getQuickPromptpay() {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'get',
            url: `${this.config.scbGateway}/v1/profiles/quickpromptpay`,
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async getSummary(accountFrom: Iaccount, numberRecentTxn: number = 2, latestTransactionFlag: boolean = false) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v2/deposits/summary`,
            data: JSON.stringify({
                tilesVersion: this.config.tilesVersion,
                numberRecentTxn,
                depositList: [
                    { accountNo: accountFrom.accountNo },
                ],
                latestTransactionFlag,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async getSummaryList(accountNos: string[], numberRecentTxn: number = 2, latestTransactionFlag: boolean = false) {
        const depositList: { accountNo: string }[] = accountNos.map((d) => {
            return {
                accountNo: d,
            }
        });
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v2/deposits/summary`,
            data: JSON.stringify({
                tilesVersion: this.config.tilesVersion,
                numberRecentTxn,
                depositList,
                latestTransactionFlag,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async scanBill(barcode: string) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v7/payments/bill/scan`,
            data: JSON.stringify({
                tilesVersion: this.config.tilesVersion,
                barcode,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async transactions(accountFrom: Iaccount, startdate: string, enddate: string, pageSize: number = 20, pageNumber: number = 1) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v2/deposits/casa/transactions`,
            data: JSON.stringify({
                pageSize,
                productType: typeof accountFrom.productType == 'object' ? accountFrom.productType.code : accountFrom.productType[0].code,
                pageNumber,
                accountNo: accountFrom.accountNo,
                startDate: startdate,
                endDate: enddate,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async topup_billers() {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'get',
            url: `${this.config.scbGateway}/v2/topup/billers`,
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }


    public async topup_create(accountFrom: Iaccount, billerId: string, serviceNumber: any, pmtAmt: any, note: string = '') {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v2/topup/billers/${billerId}/additionalinfo`,
            data: JSON.stringify({
                pmtAmt,
                billerId,
                depAcctIdFrom: accountFrom.accountNo,
                serviceNumber,
                note,
                annotation: 'null',
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }


    public async topup_confirmation(accountFrom: Iaccount, billerId: string, serviceNumber: any, pmtAmt: any, note: string = '', mobileNumber: string, billRef1: string, tx: any) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v2/topup`,
            data: JSON.stringify({
                depAcctIdFrom: accountFrom.accountNo,
                billRef2: '',
                billRef3: '',
                misc2: '',
                misc1: '',
                feeAmt: '0.0',
                note,
                serviceNumber,
                transactionToken: tx.data.transactionToken,
                pmtAmt,
                mobileNumber,
                billerId,
                billRef1,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }





    public async transfer_request_qr() {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'get',
            url: `${this.config.scbGateway}/v1/transfer/request/qr`,
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }


    public async transfer_banks() {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'get',
            url: `${this.config.scbGateway}/v1/transfer/banks`,
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async transfer_eligiblebanks() {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'get',
            url: `${this.config.scbGateway}/v1/transfer/eligiblebanks`,
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async transfer_history(pagingOffset = 1) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'get',
            url: `${this.config.scbGateway}/v2/transfer/history?pagingOffset=${pagingOffset}`,
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }



    public async transfer_create(accountFrom: Iaccount, accountTo: Iaccount, amount: number) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v2/transfer/verification`,
            data: JSON.stringify({
                accountFromType: accountFrom.productType.code,
                amount,
                annotation: null,
                transferType: accountTo.BankCode == '014' ? '3RD' : 'ORFT',
                accountToBankCode: accountTo.BankCode,
                accountTo: accountTo.accountNo,
                accountFrom: accountFrom.accountNo,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }




    public async transfer_confirmation(accountFrom: Iaccount, tx: any, amount: number) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v2/transfer/confirmation`,
            data: JSON.stringify({
                scbFee: tx.data.scbFee,
                accountTo: tx.data.accountTo,
                accountFromName: tx.data.accountFromName,
                amount,
                accountToName: tx.data.accountToName,
                botFee: tx.data.botFee,
                pccTraceNo: tx.data.pccTraceNo,
                fee: tx.data.totalFee,
                channelFee: tx.data.channelFee,
                terminalNo: tx.data.terminalNo,
                sequence: tx.data.sequence,
                feeType: tx.data.feeType,
                accountFromType: accountFrom.productType.code,
                transactionToken: tx.data.transactionToken,
                transferType: tx.data.transferType,
                accountToBankCode: tx.data.accountToBankCode,
                accountFrom: accountFrom.accountNo,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }


    public async cardlessatm_info() {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'get',
            url: `${this.config.scbGateway}/v2/cardlessatm/info`,
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async cardlessatm_create(accountFrom: Iaccount, amount: number) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v3/cardlessatm/verification`,
            data: JSON.stringify({
                paymentType: 'CCW_CASA',
                sourceOfFundNo: accountFrom.accountNo,
                tileVersion: this.config.tilesVersion,
                amount,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async cardlessatm_confirmation(tx: any) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v3/cardlessatm/verification`,
            data: JSON.stringify({
                transactionToken: tx.data.transactionToken,
                maskedMobileNo: tx.data.mobileNoList[0].maskedMobileNo,
                paymentType: 'CCW_CASA',
                mobileNoReference: tx.data.mobileNoList[0].mobileNoReference,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async cardlessatm_cancel(paymentType: any) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v3/cardlessatm/cancel`,
            data: JSON.stringify({
                paymentType,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async merchants_info() {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'get',
            url: `${this.config.scbGateway}/v1/merchants/landing`,
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async merchants_qr(walletId: string, amount: number, shopNote: string = '') {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v1/merchants/request/qr`,
            data: JSON.stringify({
                shopNote,
                walletId,
                amount,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }

    public async merchants_transactions(walletList: any) {
        const r: IScbResponse<IScbResponseStatus> = await axios({
            method: 'post',
            url: `${this.config.scbGateway}/v1/merchants/transactions`,
            data: JSON.stringify({
                walletList,
            }),
            headers: { ...this.getHeaders(), 'Api-Auth': this.config.apiAuth },
        }).catch((error) => { return error.response; });
        return r;
    }
}

export interface Iconfig {
    deviceId: string;
    pin: string;
    pinencrypt: string;
    apiAuthRefresh: string;
    apiAuth: string;
    userAgent: string;
    scbGateway: string;
    tilesVersion: string;
}

export interface IScbResponse<T> extends AxiosResponse {
    data: {
        e2ee?: { pseudoSid: string; pseudoPubKey: string; pseudoRandom: string; pseudoOaepHashAlgo: string; };
        status: T;
        data: any;
        [k: string]: any;
    }
}

interface IScbResponseStatusPseudoFE {
    statuscode: string | number | any;
}

export interface IScbResponseStatus {
    code: string | number | any;
    description: string;
    header: string
}

interface Iaccount {
    sortSequence?: number;
    nickname?: null | string;
    accountNo: string;
    accountName?: null | string;
    appId?: null | string | number;
    quickBalanceFlag?: string;
    quickPromptpayFlag?: string;
    customerTypeDesc?: string;
    customerTypeCode?: string;
    BankCode?: string;
    productType: any | {
        code: number | any
    }
}

interface IScbResponsegetAccounts extends AxiosResponse {
    data: {
        status: IScbResponseStatus;
        depositList: Iaccount[];
        cardList: any[],
        loanList: any[],
        smeLoanList: any[],
        clientList: any[],
        merchantWalletList: any[],
        prepaidCardList: any[],
        securitiesList: { registeredFlag: string, singleAppFlag: string },
        debitCard: { enableFlag: string, defaultImageURL: null | string },
        debitCardList: any[]
    }
}