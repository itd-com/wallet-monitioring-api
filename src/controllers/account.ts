/* eslint-disable no-useless-catch */
import { BankAppService } from '@domain/account/services/bankApps';
import { CustomError } from '@helpers/customError';
import { FastifyReply, FastifyRequest } from 'fastify';
import { config } from '@config/config';
import { ScbApiService } from '@domain/scbApi/services/scbApi';
import { AuthUserHook } from '@hooks/authUser';
import { AccountTransformer } from '@transformer/account';
import { LineNotifyService } from '@domain/notify/service/lineNofify';
import Decimal from 'decimal.js';
import { DateHelper } from '@helpers/date';
import { BankAccountService } from '@domain/account/services/bankAccounts';
import { TopupHistoryService } from '@domain/topup/services/topupHistories';
import { TopupTypeEnum } from '@enums/topupEnum';

export namespace AccountController {
	export const getAccountTransactions = async (request: AccountTransformer.getAccountTransactions.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			const {
				accountNo,
				startAt,
				endAt,
			} = request.query;

			const transactions = await ScbApiService.getAccountTransactions(
				reqUser,
				{
					accountNo,
					startAt,
					endAt,
				},
			);

			const resp: AccountTransformer.getAccountTransactions.ResponseData = transactions;
			return reply.send(resp);
		} catch (error) {
			throw error;
		}
	};

	export const getAccountSummary = async (request: AccountTransformer.getAccountSummary.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			const accountSummary = await ScbApiService.getAccountsSummaryList(
				reqUser,
				reqUser.bankAccounts,
			);

			const nowThai = DateHelper.getNowThai();

			if (accountSummary?.depositList && (Array.isArray(accountSummary?.depositList))) {
				for (const deposit of accountSummary.depositList) {
					const accountNoView = reqUser.bankAccounts.find((d) => d.bankAccountNo == deposit.accountNo)?.bankAccountNoView || `${deposit.accountNo}`;
					const todayTopUpData = await TopupHistoryService.getTopupTotalVolumeToDay({
						type: TopupTypeEnum.TRUEMONEY,
						bankAccountNo: deposit.accountNo,
					});
					const bankAccountBalance = Number(new Decimal(deposit.availableBalance || 0).toFixed(2));
					const todayTopUpTruemoneyBalance = Number(new Decimal(todayTopUpData.topupTotalVolume).toFixed(2));

					await BankAccountService.updateOneByCondition(
						{
							bankAccountNo: deposit.accountNo,
						},
						{
							bankAccountBalance,
							todayTopUpTruemoneyBalance,
						}
					);
					const switchBankAccountBalanceMinimum = config.SWITCH_BANK_ACCOUNT_BALANCE_MINIMUM;
					let isBalanceMinimum = false;
					if (Number(bankAccountBalance) <= Number(switchBankAccountBalanceMinimum)) {
						isBalanceMinimum = true;
					}
					const messages = [
						`📢 ${isBalanceMinimum ? '🔴' : '🟣'} SCB บัญชี ${accountNoView}\n`,
						`สาขา ${deposit.branchName}\n`,
						`\n`,
						`ยอดรวมการใช้งานวันนี้: \n`,
						` $ เติมเงิน:ทรูมันนี่วอลเล็ท ${new Decimal(todayTopUpTruemoneyBalance).toFixed(2)} บาท\n`,
						// ` $ ถอนเงิน:โอนระหว่างธนาคาร ${new Decimal(0).toFixed(2)} บาท\n`,
						// ` $ ถอนเงิน:โอนพร้อมเพย์ ${new Decimal(0).toFixed(2)} บาท\n`,
						// ` $ รับเงิน:สแกนจ่าย ${new Decimal(0).toFixed(2)} บาท\n`,
						`\n`,
						`${isBalanceMinimum ? '❗' : ''}️ยอดเงินคงเหลือ ${new Decimal(bankAccountBalance).toFixed(2)} บาท\n`,
						`🗓 ${nowThai}`,
						isBalanceMinimum ? `\n\n❗ยอดเงินคงเหลือตํ่ากว่า ${new Decimal(Number(switchBankAccountBalanceMinimum)).toFixed(2)} บาท แนะนำให้เติมเงิน\n` : '',
					];
					await LineNotifyService.sendNotify(
						reqUser,
						`${messages.join('')}`,
					);
				}

			}

			setTimeout(async () => {
				const messages = [
					`\n`,
					`📌 สามารถเช็คยอดเงินอีกครั้งโดยการคลิ๊กลิงค์ที่แนบไว้ด้านล่าง\n`,
					`♢ ${config.appUrl}/api/bank-gateway/notify?token=${reqUser.externalApiToken}\n`,
					`\n`,
				];
				await LineNotifyService.sendNotify(
					reqUser,
					`${messages.join('')}`,
				);
			}, 700);


			const resp: AccountTransformer.getAccountSummary.ResponseData = accountSummary;
			return reply.send(resp);
		} catch (error) {
			throw error;
		}
	};

	export const notifyAccountSummary = async (request: AccountTransformer.getAccountSummary.Request, reply: FastifyReply) => {
		try {
			const reqUser = AuthUserHook.getUserApi(request);

			const accountSummary = await ScbApiService.getAccountsSummaryList(
				reqUser,
				reqUser.bankAccounts,
			);

			const nowThai = DateHelper.getNowThai();

			if (accountSummary?.depositList && (Array.isArray(accountSummary?.depositList))) {
				for (const deposit of accountSummary.depositList) {
					const accountNoView = reqUser.bankAccounts.find((d) => d.bankAccountNo == deposit.accountNo)?.bankAccountNoView || `${deposit.accountNo}`;
					const todayTopUpData = await TopupHistoryService.getTopupTotalVolumeToDay({
						type: TopupTypeEnum.TRUEMONEY,
						bankAccountNo: deposit.accountNo,
					});
					const bankAccountBalance = Number(new Decimal(deposit.availableBalance || 0).toFixed(2));
					const todayTopUpTruemoneyBalance = Number(new Decimal(todayTopUpData.topupTotalVolume).toFixed(2));

					await BankAccountService.updateOneByCondition(
						{
							bankAccountNo: deposit.accountNo,
						},
						{
							bankAccountBalance,
							todayTopUpTruemoneyBalance,
						}
					);
					const switchBankAccountBalanceMinimum = config.SWITCH_BANK_ACCOUNT_BALANCE_MINIMUM;
					let isBalanceMinimum = false;
					if (Number(bankAccountBalance) <= Number(switchBankAccountBalanceMinimum)) {
						isBalanceMinimum = true;
					}
					const messages = [
						`📢 ${isBalanceMinimum ? '🔴' : '🟣'} SCB บัญชี ${accountNoView}\n`,
						`สาขา ${deposit.branchName}\n`,
						`\n`,
						`ยอดรวมการใช้งานวันนี้: \n`,
						` $ เติมเงิน:ทรูมันนี่วอลเล็ท ${new Decimal(todayTopUpTruemoneyBalance).toFixed(2)} บาท\n`,
						// ` $ ถอนเงิน:โอนระหว่างธนาคาร ${new Decimal(0).toFixed(2)} บาท\n`,
						// ` $ ถอนเงิน:โอนพร้อมเพย์ ${new Decimal(0).toFixed(2)} บาท\n`,
						// ` $ รับเงิน:สแกนจ่าย ${new Decimal(0).toFixed(2)} บาท\n`,
						`\n`,
						`${isBalanceMinimum ? '❗' : ''}️ยอดเงินคงเหลือ ${new Decimal(bankAccountBalance).toFixed(2)} บาท\n`,
						`🗓 ${nowThai}`,
						isBalanceMinimum ? `\n\n❗ยอดเงินคงเหลือตํ่ากว่า ${new Decimal(Number(switchBankAccountBalanceMinimum)).toFixed(2)} บาท แนะนำให้เติมเงิน\n` : '',
					];
					await LineNotifyService.sendNotify(
						reqUser,
						`${messages.join('')}`,
					);
				}

			}

			setTimeout(async () => {
				const messages = [
					`\n`,
					`📌 สามารถเช็คยอดเงินอีกครั้งโดยการคลิ๊กลิงค์ที่แนบไว้ด้านล่าง\n`,
					`♢ ${config.appUrl}/api/bank-gateway/notify?token=${reqUser.externalApiToken}\n`,
					`\n`,
				];
				await LineNotifyService.sendNotify(
					reqUser,
					`${messages.join('')}`,
				);
			}, 700);

			return reply.send({
				"message": 'ok',
			});
		} catch (error) {
			throw error;
		}
	};

}
