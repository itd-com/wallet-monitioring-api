import { User } from "@domain/account/models/users";
import { CustomError } from "@helpers/customError";

export namespace LineNotifyService {
    export const sendNotify = async (
        reqUser: User.apiT,
        message: string,
    ): Promise<any> => {

        if (!reqUser.bankApp.notifyToken1) {
            throw new CustomError({
                statusCode: 404,
                message: `bankApps notifyToken1 must not be NULL by id=${reqUser.bankApp.id}`,
            });
        }

        try {
            var axios = require("axios").default;

            var options = {
                method: 'POST',
                url: 'https://notify-api.line.me/api/notify',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${reqUser.bankApp.notifyToken1}`,
                },
                data: { message }
            };

            axios.request(options).then(function (response) {
                // console.log(response.data);
            }).catch(function (error) {
                console.error(error);
            });
        } catch (error) {
            // throw error;
        }

    };
}
