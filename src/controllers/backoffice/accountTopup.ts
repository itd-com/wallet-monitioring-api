/* eslint-disable no-useless-catch */
import { FastifyReply } from 'fastify';
import { AuthUserHook } from '@hooks/authUser';
import { BackOfficeUserAccountTopupTransformer } from '@transformer/backoffice/accountTopup';
import { TopupHistoryService } from '@domain/topup/services/topupHistories';
import { UserRoleEnum } from '@enums/userEnum';
import { CustomError } from '@helpers/customError';

export namespace BackOfficeAccountTopupController {
    export const getAccountTopup = async (request: BackOfficeUserAccountTopupTransformer.getAccountTopup.Request, reply: FastifyReply) => {
        try {

            const reqUser = AuthUserHook.getUserApi(request);

            switch (reqUser.role) {
                case UserRoleEnum.MY_APP:
                case UserRoleEnum.CUSTOMER:
                case UserRoleEnum.CUSTOMER_READ_ONLY:
                    var topupHistories = await TopupHistoryService.getManyByCondition({
                        serviceName: reqUser.serviceName,
                    });

                    var resp: BackOfficeUserAccountTopupTransformer.getAccountTopup.ResponseData = topupHistories;
                    return reply.send(resp);


                case UserRoleEnum.ADMIN:
                case UserRoleEnum.ADMIN_READ_ONLY:
                case UserRoleEnum.SUPER_ADMIN:
                    var topupHistories = await TopupHistoryService.getManyByCondition();

                    var resp: BackOfficeUserAccountTopupTransformer.getAccountTopup.ResponseData = topupHistories;
                    return reply.send(resp);

                default:
                    break;
            }

            throw new CustomError({
                statusCode: 500,
                message: `Invalid role permission getUsers.`,
            })

        } catch (error) {
            throw error;
        }
    };
}
