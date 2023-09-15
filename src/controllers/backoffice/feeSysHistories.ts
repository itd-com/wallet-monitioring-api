/* eslint-disable no-useless-catch */
import { CustomError } from '@helpers/customError';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthUserHook } from '@hooks/authUser';
import { UserRoleEnum } from '@enums/userEnum';
import { BackOfficeFeeSysHistoryTransformer } from '@transformer/backoffice/feeSysHistories';
import { FeeSysHistoryService } from '@domain/feeSys/services/feeSysHistories';

export namespace BackOfficeFeeSysHistoryController {
    export const getFeeSysHistorise = async (request: BackOfficeFeeSysHistoryTransformer.getFeeSysHistorise.Request, reply: FastifyReply) => {
        try {
            const reqUser = AuthUserHook.getUserApi(request);

            switch (reqUser.role) {
                case UserRoleEnum.MY_APP:
                case UserRoleEnum.CUSTOMER:
                case UserRoleEnum.CUSTOMER_READ_ONLY:
                    var feeSysHistories = await FeeSysHistoryService.getManyByCondition({
                        serviceName: reqUser.serviceName,
                    });

                    var resp: BackOfficeFeeSysHistoryTransformer.getFeeSysHistorise.ResponseData = feeSysHistories;
                    return reply.send(resp);

                case UserRoleEnum.ADMIN:
                case UserRoleEnum.ADMIN_READ_ONLY:
                case UserRoleEnum.SUPER_ADMIN:
                    var feeSysHistories = await FeeSysHistoryService.getManyByCondition();

                    var resp: BackOfficeFeeSysHistoryTransformer.getFeeSysHistorise.ResponseData = feeSysHistories;
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
