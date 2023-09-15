import { CommonValidator } from '@hooks/common';
import { FastifyInstance } from 'fastify';
import { AuthBankAppHook } from '@hooks/authBankApp';
import { AccountPaymentController } from '@controllers/accountPayment';
import { AccountPaymentSchema } from './schema/accountPayment';
import { AuthUserHook } from '@hooks/authUser';

const accountPaymentRoute = async (app: FastifyInstance) => {
    app.post(
        '/account/payment/qr-payment',
        {
            schema: AccountPaymentSchema.createQrPayment,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyApiTokenExpired,
                AuthBankAppHook.login,
                AuthBankAppHook.setBankAccountActiveForCreateRequsetServiceQrPayment,
            ],
        },
        AccountPaymentController.createQrPayment,
    );

    app.get(
        '/account/payment/qr-payment/:requestId',
        {
            schema: AccountPaymentSchema.getQrPaymentByRequestId,
            preHandler: [
                CommonValidator.postValidator,
                AuthUserHook.verifyApiTokenExpired,
                AuthBankAppHook.login,
                AuthBankAppHook.setBankAccountActiveForGetRequsetServiceQrPayment,
            ],
        },
        AccountPaymentController.getQrPaymentByRequestId,
    );
};

export default accountPaymentRoute;
