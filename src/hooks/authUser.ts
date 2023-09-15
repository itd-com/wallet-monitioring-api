import { FastifyRequest } from 'fastify';
import { isPast } from 'date-fns';
import { CustomError } from '@helpers/customError';
import { InternalServalError } from '../errors/database';
import { AuthorizationTokenExpired, AuthorizationTokenInvalid, AuthorizationTokenNotFound, BadRequestAuthorization, NoAuthorizationHeader } from '../errors/auth';
import { UserRoleEnum } from '@enums/userEnum';
import { UserService } from '@domain/account/services/users';
import { BankAppService } from '@domain/account/services/bankApps';
import { User } from '@domain/account/models/users';
import { BankAccountService } from '@domain/account/services/bankAccounts';
import { BankApp } from '@domain/account/models/bankApps';
import { OpensslHelper } from '@helpers/openssl';
import { BankAccount } from '@domain/account/models/bankAccounts';

export namespace AuthUserHook {

    export const getUserApi = (request: FastifyRequest): User.apiT => {
        if (request.userApi) return request.userApi;
        throw new CustomError({
            statusCode: 500,
            message: 'userApi not found.'
        });
    };

    export const getAccessTokenFromRequest = (request: FastifyRequest): string => {
        const accessToken = request.headers?.['authorization'] || '';
        if (!accessToken) {
            throw new CustomError(NoAuthorizationHeader);
        }

        return `${accessToken}`;
    };

    export const getApiTokenFromRequest = (request: FastifyRequest): string => {
        const accessToken = request.headers?.['api-token'] || '';
        if (!accessToken) {
            throw new CustomError(NoAuthorizationHeader);
        }

        return `${accessToken}`;
    };

    export const getExternalApiTokenFromRequest = (request: FastifyRequest): string => {
        const accessToken = request.query?.['token'] || '';
        if (!accessToken) {
            throw new CustomError(NoAuthorizationHeader);
        }

        return `${accessToken}`;
    };

    export const verifyAccessTokenExpired = async (request: FastifyRequest): Promise<void> => {
        const token = getAccessTokenFromRequest(request);
        try {
            const username = OpensslHelper.privateDecrypt(token);
            const user = await UserService.getOneByCondition({
                username,
                accessToken: token,
            });
            if (!user) {
                throw new CustomError(AuthorizationTokenNotFound);
            }

            const isTokenExpired = isPast(new Date(user.accessTokenExpire));
            if (isTokenExpired) {
                throw new CustomError(AuthorizationTokenExpired);
            }

            if ([UserRoleEnum.MY_APP].includes(user.role)) {
                const bankApp = await BankAppService.getOneByCondition({
                    serviceName: user.serviceName,
                });
                if (!bankApp) {
                    throw new CustomError({
                        statusCode: 404,
                        message: `bankApps not found by serviceName=${user.serviceName}`,
                    });
                }
                const bankAppDcd = await BankAppService.getDecryptedData(bankApp);

                const bankAccounts = await BankAccountService.getManyByCondition({
                    bankAppId: bankAppDcd.id,
                });
                if (!bankAccounts || (bankAccounts && bankAccounts.length < 1)) {
                    throw new CustomError({
                        statusCode: 404,
                        message: `bankAccounts not found by userId=${user.id}`,
                    });
                }

                const userApi: User.apiT = {
                    ...user,
                    bankApp: bankAppDcd,
                    bankAccountActive: bankAccounts[0],
                    bankAccounts: bankAccounts,
                };

                Object.assign(request, { userApi: userApi });

                return Promise.resolve();
            } else {
                const mockBankApp: BankApp.Decrypted = {
                    id: 0,
                    name: 'Mock',
                    serviceName: 'Mock',

                    feePaymentRate: '0.00',
                    feeTopupRate: '0.00',
                    feeBankTransferRate: '0.00',

                    notifyToken1: 'Mock',
                    notifyToken2: 'Mock',

                    enableServiceQrPayment: false,
                    enableServiceTopup: false,
                    enableServiceBankTransfer: false,

                    bankDeviceId: 'Mock',
                    bankPin: 'Mock',
                    bankApiAuthRefresh: 'Mock',
                    bankApiAuth: 'Mock',
                    bankApiAuthExpire: new Date(),

                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const mockBankAccount: BankAccount.T = {
                    id: 0,
                    name: 'Mock',
                    serviceName: 'Mock',
                    bankAppId: 0,

                    bankAccountBalance: 0,
                    todayTopUpTruemoneyBalance: 0,

                    enableServiceQrPayment: false,
                    enableServiceTopup: false,
                    enableServiceBankTransfer: false,

                    bankAccountNo: 'Mock',
                    bankAccountNoView: 'Mock',
                    bankPromptPayNo: 'Mock',
                    bankAccountNameTh: 'Mock',
                    bankAccountNameEn: 'Mock',
                    bankBranchName: 'Mock',

                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const userApi: User.apiT = {
                    ...user,
                    bankApp: mockBankApp,
                    bankAccountActive: mockBankAccount,
                    bankAccounts: [mockBankAccount],
                };

                Object.assign(request, { userApi: userApi });

                return Promise.resolve();

            }



        } catch (error) {
            if (error.code === 'ERR_OSSL_RSA_OAEP_DECODING_ERROR') {
                throw new CustomError(AuthorizationTokenInvalid);
            }
            throw error;
        }


    };

    export const verifyApiTokenExpired = async (request: FastifyRequest): Promise<void> => {
        const token = getApiTokenFromRequest(request);
        const user = await UserService.getOneByCondition({
            apiToken: token,
        });
        if (!user) {
            throw new CustomError(AuthorizationTokenNotFound);
        }

        const isTokenExpired = isPast(new Date(user.apiTokenExpire));
        if (isTokenExpired) {
            throw new CustomError(AuthorizationTokenExpired);
        }

        if ([UserRoleEnum.MY_APP].includes(user.role)) {
            const bankApp = await BankAppService.getOneByCondition({
                serviceName: user.serviceName,
            });
            if (!bankApp) {
                throw new CustomError({
                    statusCode: 404,
                    message: `bankApps not found by serviceName=${user.serviceName}`,
                });
            }
            const bankAppDcd = await BankAppService.getDecryptedData(bankApp);

            const bankAccounts = await BankAccountService.getManyByCondition({
                bankAppId: bankAppDcd.id,
            });
            if (!bankAccounts || (bankAccounts && bankAccounts.length < 1)) {
                throw new CustomError({
                    statusCode: 404,
                    message: `bankAccounts not found by userId=${user.id}`,
                });
            }

            const userApi: User.apiT = {
                ...user,
                bankApp: bankAppDcd,
                bankAccountActive: bankAccounts[0],
                bankAccounts: bankAccounts,
            };

            Object.assign(request, { userApi: userApi });

            return Promise.resolve();

        }

        throw new CustomError({
            statusCode: 401,
            message: 'INVALID_API_ROLE',
        })


    };

    export const verifyExternalApiTokenExpired = async (request: FastifyRequest): Promise<void> => {
        const token = getExternalApiTokenFromRequest(request);
        const user = await UserService.getOneByCondition({
            externalApiToken: token,
        });
        if (!user) {
            throw new CustomError(AuthorizationTokenNotFound);
        }

        const isTokenExpired = isPast(new Date(user.externalApiTokenExpire));
        if (isTokenExpired) {
            throw new CustomError(AuthorizationTokenExpired);
        }

        if ([UserRoleEnum.MY_APP].includes(user.role)) {
            const bankApp = await BankAppService.getOneByCondition({
                serviceName: user.serviceName,
            });
            if (!bankApp) {
                throw new CustomError({
                    statusCode: 404,
                    message: `bankApps not found by serviceName=${user.serviceName}`,
                });
            }
            const bankAppDcd = await BankAppService.getDecryptedData(bankApp);

            const bankAccounts = await BankAccountService.getManyByCondition({
                bankAppId: bankAppDcd.id,
            });
            if (!bankAccounts || (bankAccounts && bankAccounts.length < 1)) {
                throw new CustomError({
                    statusCode: 404,
                    message: `bankAccounts not found by userId=${user.id}`,
                });
            }

            const userApi: User.apiT = {
                ...user,
                bankApp: bankAppDcd,
                bankAccountActive: bankAccounts[0],
                bankAccounts: bankAccounts,
            };

            Object.assign(request, { userApi: userApi });

            return Promise.resolve();
        }

        throw new CustomError({
            statusCode: 401,
            message: 'INVALID_API_ROLE',
        })

    };

    export const verifyAdminRole = async (request: FastifyRequest): Promise<void> => {
        const user = getUserApi(request);
        if (user.role !== UserRoleEnum.ADMIN) {
            throw new CustomError({
                message: 'Authorization Role is invalid',
                statusCode: 401,
            });
        }
        return Promise.resolve();
    };
}
